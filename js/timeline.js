// 初始化地图
const map = L.map('map').setView([35,105],4);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{ maxZoom:18 }).addTo(map);

const typeChart = echarts.init(document.getElementById('type-chart'));
const infoBox = document.getElementById('bridge-info');

// 按朝代分组桥梁
// 朝代顺序
const dynastyOrder = [
  "新石器时代", "夏", "商", "西周", "秦、汉","隋", "唐", "宋","金",
  "元", "明", "清", "民国"
];
const timelineData={};
bridges.forEach(b=>{
    const d=b.dynasty||"未知";
    if(!timelineData[d]) timelineData[d]=[];
    timelineData[d].push(b);
});
const dynasties = Object.keys(timelineData).sort((a,b)=>dynastyOrder.indexOf(a)-dynastyOrder.indexOf(b));

// 滑块元素
const slider = document.getElementById('slider');
slider.max=dynasties.length-1;

// 播放按钮
const playBtn=document.getElementById('play-pause');
let isPlaying=false,interval;

// 存放地图标记
let mapMarkers = [];

// 根据桥梁类型返回颜色
function colorByType(type){
    switch(type){
        case "拱桥": return "gray";
        case "梁桥": return "brown";
        case "廊桥": return "green";
        default: return "blue";
    }
}

function updateVisuals(index){
    const dynasty=dynasties[index];
    const bridgesList=timelineData[dynasty];

    // 清空旧标记
    mapMarkers.forEach(m=>map.removeLayer(m));
    mapMarkers=[];

    // 更新地图+信息框+连线
    infoBox.innerHTML='';
    bridgesList.forEach(b=>{
        if(b.lat&&b.lng){
            const marker=L.circleMarker([b.lat,b.lng],{
                radius:6,
                color:colorByType(b.type),
                fillOpacity:0.8
            }).addTo(map);
            marker.bindPopup(`<b>${b.name}</b><br>类型:${b.type}<br>建材:${b.material}`);
            marker.bindPopup(
                `<strong>${bridge.name || "未命名桥梁"}</strong>${isFeaturedBridge(bridge) ? ' <span style="color:#E6C07B;">★重点桥梁</span>' : ''}<br>` +
                `朝代：${bridge.dynasty || "未知"}<br>` +
                `类型：${bridge.type || "未知"}<br>` +
                `建材：${bridge.material || "未知"}`
                );
            marker.on('click',()=>window.location.href=`bridge_detail.html?id=${b.id}`);
            mapMarkers.push(marker);

            // 信息框中添加
            const div=document.createElement('div');
            div.innerHTML=`<b>${b.name}</b> (${b.type}, ${b.material})`;
            infoBox.appendChild(div);
        }
    });

    // 横向柱状图
    const typeCount={};
    bridgesList.forEach(b=>typeCount[b.type]=(typeCount[b.type]||0)+1);
    typeChart.setOption({
        title:{ text:`${dynasty} 朝桥梁类型分布`},
        tooltip:{},
        xAxis:{ type:'value' },
        yAxis:{ type:'category', data:Object.keys(typeCount).reverse()},
        series:[{ type:'bar', data:Object.values(typeCount).reverse(), itemStyle:{color:'#336699'} }]
    });

    document.getElementById('current-dynasty').textContent=dynasty;

    // 聚焦地图
    if(bridgesList.length>0){
        const latSum=bridgesList.reduce((s,b)=>s+(b.lat||0),0);
        const lngSum=bridgesList.reduce((s,b)=>s+(b.lng||0),0);
        map.flyTo([latSum/bridgesList.length,lngSum/bridgesList.length],5);
    }
}

slider.addEventListener('input',e=>updateVisuals(parseInt(e.target.value)));
playBtn.addEventListener('click',()=>{
    isPlaying=!isPlaying;
    playBtn.textContent=isPlaying?"暂停":"播放";
    if(isPlaying){
        interval=setInterval(()=>{
            let idx=parseInt(slider.value);
            idx=(idx+1)%dynasties.length;
            slider.value=idx;
            updateVisuals(idx);
        },1500);
    } else clearInterval(interval);
});

updateVisuals(0);