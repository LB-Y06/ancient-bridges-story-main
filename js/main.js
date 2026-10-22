(function () {
  if (!Array.isArray(bridges)) {
    console.error("bridges_data.js 未正确加载。");
    return;
  }

  const bridgeData = bridges.filter(item => item && typeof item === "object");

  const featuredNames = [
    "安济桥（大石桥）",
    "洛阳桥",
    "广济桥",
    "宝带桥",
    "程阳永济桥",
    "泰顺廊桥",
    "双龙桥",
    "八字桥"
  ];
  const featuredBridgeIds = [58, 68, 69, 285, 41, 558,758];

  const dynastyBaseOrder = [
    "新石器时代", "夏", "商", "西周", 
    "秦、汉", "隋", "唐", "宋", "金", "元", "明", "清", "民国"
  ];

  const typeColors = {
  "拱桥": "#5A6D74",
  "梁桥": "#9C6B3F",
  "风雨桥": "#6A7B5B",
  "木桥": "#6A7B5B",
  "石桥": "#5A6D74",
  "默认": "#A38E72"
};

  const chartColors = {
  primary: "#5A6D74",
  secondary: "#9C6B3F",
  tertiary: "#6A7B5B",
  accent: "#C7A46A",
  lightText: "rgba(255,255,255,0.82)",
  darkText: "#5E5A52",
  splitLine: "rgba(90,80,70,0.08)",
  splitLineDark: "rgba(255,255,255,0.08)"
};

  // -------------------------- 新增：大区-省份映射 --------------------------
  const regionMapping = {
    // 华北
    "河北省": "华北", "山西省": "华北", "内蒙古自治区": "华北", "北京市": "华北", "天津市": "华北",
    // 东北
    "辽宁省": "东北", "吉林省": "东北", "黑龙江省": "东北",
    // 华东
    "江苏省": "华东", "浙江省": "华东", "安徽省": "华东", "福建省": "华东", "江西省": "华东", "山东省": "华东", "上海市": "华东",
    // 华中
    "河南省": "华中", "湖北省": "华中", "湖南省": "华中",
    // 华南
    "广东省": "华南", "广西壮族自治区": "华南", "海南省": "华南",
    // 西南
    "四川省": "西南", "贵州省": "西南", "云南省": "西南", "重庆市": "西南", "西藏自治区": "西南",
    // 西北
    "陕西省": "西北", "甘肃省": "西北", "青海省": "西北", "宁夏回族自治区": "西北", "新疆维吾尔自治区": "西北"
};

  // 根据location字段自动判断所属大区
  function getRegion(location) {
    if (!location) return "未知";
    for (const province in regionMapping) {
      if (location.includes(province)) {
        return regionMapping[province];
      }
    }
    return "未知";
}

  const CHINA_GEOJSON_PATH = "assets/geo/china-provinces.geojson";

  function normalizeDynasty(d) {
    return (d || "未知").trim();
  }

  function getDynastyRank(dynasty) {
    const text = normalizeDynasty(dynasty);

    for (let i = 0; i < dynastyBaseOrder.length; i++) {
      if (text.includes(dynastyBaseOrder[i])) {
        return i;
      }
    }
    return 999;
  }

  function groupBy(arr, keyGetter) {
    const map = {};
    arr.forEach(item => {
      const key = keyGetter(item);
      if (!map[key]) map[key] = [];
      map[key].push(item);
    });
    return map;
  }

  function countBy(arr, keyGetter) {
    const map = {};
    arr.forEach(item => {
      const key = keyGetter(item);
      map[key] = (map[key] || 0) + 1;
    });
    return map;
  }

  function sortedEntries(obj, desc = true) {
    return Object.entries(obj).sort((a, b) => desc ? b[1] - a[1] : a[1] - b[1]);
  }

  function getTypeColor(type) {
    return typeColors[type] || typeColors["默认"];
  }

  function isFeaturedBridge(bridge) {
  return featuredBridgeIds.includes(Number(bridge.id));
}

  function getBridgeMarkerStyle(bridge, scene = "default") {
    const baseColor = getTypeColor(bridge.type);
    const featured = isFeaturedBridge(bridge);

    if (scene === "overview") {
      return featured
        ? {
            radius: 7.5,
            color: "#C7A46A",
            weight: 2.2,
            fillColor: baseColor,
            fillOpacity: 0.95
          }
        : {
            radius: 4.5,
            color: baseColor,
            weight: 1.2,
            fillColor: baseColor,
            fillOpacity: 0.78
          };
    }

    if (scene === "timeline") {
      return featured
        ? {
            radius: 8.5,
            color: "#E6C07B",
            weight: 2.4,
            fillColor: baseColor,
            fillOpacity: 0.96
          }
        : {
            radius: 6.5,
            color: baseColor,
            weight: 1.6,
            fillColor: baseColor,
            fillOpacity: 0.88
          };
    }

    if (scene === "type") {
      return featured
        ? {
            radius: 8,
            color: "#C7A46A",
            weight: 2.2,
            fillColor: baseColor,
            fillOpacity: 0.95
          }
        : {
            radius: 5.5,
            color: baseColor,
            weight: 1.3,
            fillColor: baseColor,
            fillOpacity: 0.82
          };
    }

    return featured
      ? {
          radius: 8,
          color: "#C7A46A",
          weight: 2,
          fillColor: baseColor,
          fillOpacity: 0.95
        }
      : {
          radius: 5,
          color: baseColor,
          weight: 1.2,
          fillColor: baseColor,
          fillOpacity: 0.82
        };
}

 async function createChinaGeoMap(containerId, center = [35.2, 104.5], zoom = 4) {
  const map = L.map(containerId, {
    zoomControl: false,
    attributionControl: false,
    minZoom: 3,
    maxZoom: 8
  }).setView(center, zoom);

  // 使用在线地图瓦片（卫星图）
  L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri',
    maxZoom: 18
  }).addTo(map);

  // 可选：添加中国省份边界（可选保留）
  try {
    const response = await fetch(CHINA_GEOJSON_PATH);
    const chinaGeoJson = await response.json();

    const geoLayer = L.geoJSON(chinaGeoJson, {
      style: () => ({
        color: "rgba(0, 0, 0, 0.8)",  // 黑色线条，80% 不透明度
        weight: 1,
        fillColor: "transparent",
        fillOpacity: 0
      })
    }).addTo(map);

    const bounds = geoLayer.getBounds();
    map.fitBounds(bounds, {
      padding: [20, 20]
    });

    return { map, geoLayer, bounds };
  } catch (e) {
    console.warn("GeoJSON 加载失败，使用默认视图");
    return { map, geoLayer: null, bounds: null };
  }
}

  function makeNarrative(bridge) {
    const dynasty = bridge.dynasty || "未知时代";
    const location = bridge.location || "未知地区";
    const type = bridge.type || "未知桥型";
    const material = bridge.material || "未知材料";
    const yearText = bridge.year ? `${bridge.year}年前后` : "具体年代待考";
    return `${bridge.name}位于${location}，现有数据将其归入${dynasty}，类型为${type}，建材以${material}为主。` +
      `从现有可视化信息看，这座桥既是地域交通网络中的节点，也体现了古代桥梁因地制宜的结构与选材智慧。` +
      `其年代信息可概括为${yearText}，适合结合所在地区桥梁分布、桥型特征与工程背景进行进一步解读。`;
  }

  function getTypeNarrative(type) {
    if (type === "拱桥") {
      return "拱桥是以拱圈为主要承重结构的桥梁，在竖向荷载作用下以受压为主，能充分发挥石材、砖等材料的抗压性能，是中国古桥中数量最多、技术成就最高的桥型。拱桥按拱轴线可分为半圆拱、圆弧拱、马蹄拱、折边拱、悬链线拱等，按砌筑方式分为并列拱、横联拱、乱石拱等。其结构由主拱圈、拱上填料、侧墙、墩台与桥面组成，具有跨越能力大、造型优美、耐久性强等特点，代表桥梁有赵州桥（安济桥）、永通桥、宝带桥、小商桥等。";
    }
    if (type === "梁桥") {
      return "梁桥是以水平梁体直接承重的最简单桥型，也是中国出现最早的桥梁形式。主要依靠主梁受弯受力，构造简洁、施工便捷，适合平原、水乡等中小跨径场景。按材料可分为木梁桥与石梁桥，常见形式有平梁桥、伸臂梁桥、堤梁桥、汀步桥等。结构主要由主梁、桥墩、桥台、桥面与栏杆组成，整体平直、通行便利，是古代城乡交通的主流桥型。代表桥梁有洛阳桥、安平桥、江东桥、八字桥等。";
    }
    if (type === "廊桥") {
      return "廊桥（风雨桥）是带廊屋的木拱或木梁桥，主要流行于侗族、苗族等少数民族地区及浙闽一带，因桥上建廊可遮风避雨而得名。其核心结构多采用木拱编梁体系（三节苗、五节苗），以榫卯咬合、无钉无铆，整体亦梁亦拱，受力合理、稳定性强。廊屋不仅提供庇护，还能增加桥体自重、提升抗洪水与风毁能力。风雨桥集交通、休憩、祭祀、民俗功能于一体，是极具地域文化特色的桥型，代表有程阳永济桥、地坪风雨桥、岜团桥、泰顺廊桥等。";
    }
    return "从整体看，不同桥型的形成与分布均与地形、水系、材料资源及地方工艺传统存在明显联系。";
  }

  function toTimelineGroups(data) {
    const groups = groupBy(data, item => normalizeDynasty(item.dynasty));
    const dynasties = Object.keys(groups).sort((a, b) => getDynastyRank(a) - getDynastyRank(b));

    return dynasties.map(dynasty => ({
      dynasty,
      bridges: groups[dynasty].slice().sort((a, b) => {
        const ay = a.year || 999999;
        const by = b.year || 999999;
        return ay - by;
      })
    }));
  }

  function initOverviewStats() {
    const totalCount = bridgeData.length;
    const typeCount = new Set(bridgeData.map(item => item.type).filter(Boolean)).size;
    const materialCount = new Set(bridgeData.map(item => item.material).filter(Boolean)).size;
    const dynastyCount = new Set(bridgeData.map(item => normalizeDynasty(item.dynasty))).size;

    document.getElementById("totalCount").textContent = totalCount;
    document.getElementById("typeCount").textContent = typeCount;
    document.getElementById("materialCount").textContent = materialCount;
    document.getElementById("dynastyCount").textContent = dynastyCount;
  }

  // -------------------------- 新增：古桥总览地图点击详情渲染 --------------------------
  function renderOverviewBridgeDetail(bridge) {
    const detailPanel = document.getElementById("overviewBridgeDetail");
    const nameDom = document.getElementById("overviewBridgeName");
    const dynastyDom = document.getElementById("overviewBridgeDynasty");
    const typeDom = document.getElementById("overviewBridgeType");
    const materialDom = document.getElementById("overviewBridgeMaterial");
    const locationDom = document.getElementById("overviewBridgeLocation");
    const descDom = document.getElementById("overviewBridgeDesc");
    const imgDom = document.getElementById("overviewBridgeImg");
    const goToDetailBtn = document.getElementById("goToDetailBtn");

    // 如果没有桥梁数据，隐藏卡片
    if (!bridge) {
      detailPanel.style.display = "none";
      return;
    }

    // 1. 填充基础信息
    nameDom.textContent = bridge.name || "未命名桥梁";
    dynastyDom.textContent = `朝代：${bridge.dynasty || "未知"}`;
    typeDom.textContent = `类型：${bridge.type || "未知"}`;
    materialDom.textContent = `建材：${bridge.material || "未知"}`;
    locationDom.textContent = `位置：${bridge.location || "未知"}`;
    descDom.textContent = makeNarrative(bridge); // 复用你已有的描述函数

    // 2. 加载桥梁图片（自动加载 + 加载失败用默认图）
    imgDom.src = `assets/images/bridge_${bridge.id}.png`;
    imgDom.onerror = function() {
      this.src = "assets/images/arch.png"; // 用你项目里现有的arch.png当默认图
    };

    // 3. 点击按钮跳转到完整详情页
    goToDetailBtn.onclick = function() {
      window.location.href = `bridge_detail.html?id=${bridge.id}`;
    };

    // 4. 显示详情卡片
    detailPanel.style.display = "block";
  }

  async function initOverviewMap() {
  const { map } = await createChinaGeoMap("overviewMap", [35.2, 104.5], 4);

  bridgeData.forEach(item => {
    if (!item.lat || !item.lng) return;

    const markerStyle = getBridgeMarkerStyle(item, "overview");

    const marker = L.circleMarker([item.lat, item.lng], markerStyle)
      .bindPopup(
        `<strong>${item.name || "未命名桥梁"}</strong>${isFeaturedBridge(item) ? ' <span style="color:#A88447;">★重点桥梁</span>' : ''}<br>` +
        `朝代：${item.dynasty || "未知"}<br>` +
        `类型：${item.type || "未知"}<br>` +
        `建材：${item.material || "未知"}`
      )
      .addTo(map);

    
    marker.on('click', () => {
      renderOverviewBridgeDetail(item); 
    });
  });

  return map;
}

  function renderHorizontalBar(chartDomId, dataObj, title, color) {
  const chart = echarts.init(document.getElementById(chartDomId));
  const entries = sortedEntries(dataObj, true);
  const names = entries.map(item => item[0]).reverse();
  const values = entries.map(item => item[1]).reverse();

  chart.setOption({
    animationDuration: 1200,
    animationEasing: "cubicOut",
    grid: { top: 18, left: 96, right: 24, bottom: 18, containLabel: true },
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "shadow" },
      backgroundColor: "rgba(255,251,244,0.96)",
      borderColor: "rgba(120,95,60,0.10)",
      borderWidth: 1,
      textStyle: { color: "#3E3A35" }
    },
    xAxis: {
      type: "value",
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: chartColors.darkText },
      splitLine: { lineStyle: { color: chartColors.splitLine } }
    },
    yAxis: {
      type: "category",
      data: names,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: chartColors.darkText }
    },
    series: [{
      type: "bar",
      data: values,
      barWidth: 16,
      itemStyle: {
        color,
        borderRadius: [0, 10, 10, 0]
      },
      label: {
        show: true,
        position: "right",
        color: chartColors.darkText
      }
    }]
  });

  window.addEventListener("resize", () => chart.resize());
  return chart;
}

  // -------------------------- 新增：桑基图工具函数 --------------------------
  // 生成桑基图数据（地域→桥型）
  function generateSankeyData(bridgesList) {
    const nodes = [];
    const links = [];
    const regionSet = new Set();
    const typeSet = new Set();
    const materials = new Set();

    // 收集所有节点
    bridgesList.forEach(bridge => {
      const region = getRegion(bridge.location);
      const type = bridge.type || "未知类型";
      const material = bridge.material || "未知材料";
      regionSet.add(region);
      typeSet.add(type);
      materials.add(material);
    });

    // 按顺序添加节点（三层结构）
    regionSet.forEach(r => nodes.push({ name: r }));
    typeSet.forEach(t => nodes.push({ name: t }));
    materials.forEach(m => nodes.push({ name: m }));

    // 生成地域→桥型的连接数据
    const linkMap = {};
    const materialLinkMap = {}; 

    bridgesList.forEach(bridge => {
      const region = getRegion(bridge.location);
      const type = bridge.type || "未知";
      const material = bridge.material || "未知材料";
      const key = `${region}-${type}`;
      linkMap[key] = (linkMap[key] || 0) + 1;
    
      const matKey = `${type}-${material}`;
      materialLinkMap[matKey] = (materialLinkMap[matKey] || 0) + 1;
    });

    // 转换为ECharts需要的格式
    for (const key in linkMap) {
      const [region, type] = key.split("-");
      links.push({
        source: region,
        target: type,
        value: linkMap[key]
      });
    }

    for (const key in materialLinkMap) {
      const [type, material] = key.split("-");
      links.push({
        source: type,
        target: material,
        value: materialLinkMap[key]
      });
    }

    return { nodes, links };
}

  // 渲染桑基图
  function renderSankeyChart(chart, data, dynasty) {
    chart.setOption({
      title: {
        text: `${dynasty}时期桥梁分布`,
        left: "center",
        textStyle: { color: chartColors.lightText, fontSize: 14 }
      },
      tooltip: {
        trigger: "item",
        backgroundColor: "rgba(37,47,51,0.95)",
        borderColor: "rgba(199,164,106,0.16)",
        textStyle: { color: "rgba(255,245,229,0.92)" }
      },
      series: {
        type: "sankey",
        layout: "horizontal",
        nodeAlign: "left",
        data: data.nodes,
        links: data.links,
        lineStyle: {
          color: "source",
          curveness: 0.5,
          opacity: 0.6
        },
        itemStyle: {
          color: chartColors.accent,
          borderColor: chartColors.lightText,
          borderWidth: 1
        },
        label: {
          color: chartColors.lightText
        }
      }
    });
  }

  function initOverviewCharts() {
    const typeCount = countBy(bridgeData.filter(item => item.type), item => item.type);
    const materialCount = countBy(bridgeData.filter(item => item.material), item => item.material);
    const dynastyCount = countBy(bridgeData, item => normalizeDynasty(item.dynasty));

    renderHorizontalBar("typeChart", typeCount, "桥梁类型统计", chartColors.primary);
    renderHorizontalBar("materialChart", materialCount, "桥梁建材统计", chartColors.secondary);

    const dynastyEntries = Object.entries(dynastyCount).sort((a, b) => getDynastyRank(a[0]) - getDynastyRank(b[0]));
    const dynastyChart = echarts.init(document.getElementById("dynastyChart"));
    dynastyChart.setOption({
        animationDuration: 1200,
        animationEasing: "cubicOut",
        grid: { top: 30, left: 38, right: 24, bottom: 50, containLabel: true },
        tooltip: {
            trigger: "axis",
            backgroundColor: "rgba(255,251,244,0.96)",
            borderColor: "rgba(120,95,60,0.10)",
            borderWidth: 1,
            textStyle: { color: "#3E3A35" }
        },
        xAxis: {
            type: "category",
            data: dynastyEntries.map(item => item[0]),
            axisLabel: { interval: 0, rotate: 36, color: chartColors.darkText },
            axisLine: { lineStyle: { color: "rgba(80,70,60,0.18)" } },
            axisTick: { show: false }
        },
        yAxis: {
            type: "value",
            axisLabel: { color: chartColors.darkText },
            splitLine: { lineStyle: { color: chartColors.splitLine } }
        },
        series: [{
            type: "bar",
            data: dynastyEntries.map(item => item[1]),
            barWidth: 26,
            itemStyle: {
            color: chartColors.tertiary,
            borderRadius: [10, 10, 0, 0]
            },
            label: {
            show: true,
            position: "top",
            color: chartColors.darkText
            }
        }]
        });

    window.addEventListener("resize", () => dynastyChart.resize());
  }

async function initTimelineSection() {
  const timelineGroups = toTimelineGroups(bridgeData);
  const slider = document.getElementById("timelineSlider");
  const playPauseBtn = document.getElementById("playPauseBtn");
  const currentLabel = document.getElementById("timelineCurrentLabel");
  const badge = document.getElementById("currentDynastyBadge");
  const infoCard = document.getElementById("bridgeInfoCard");
  const caption = document.getElementById("timelineCaption");
  const mapWrap = document.getElementById("timelineMapWrap");
  const svgLayer = document.getElementById("timelineLinkLayer");

  slider.max = Math.max(0, timelineGroups.length - 1);

  const mapResult = await createChinaGeoMap("timelineMap", [35.2, 104.5], 4);
  const map = mapResult.map;

  const typeChart = echarts.init(document.getElementById("timelineTypeChart"));
  // 新增：初始化桑基图实例
  const sankeyChart = echarts.init(document.getElementById("timelineSankeyChart"));

  let currentIndex = 0;
  let isPlaying = false;
  let timer = null;
  let markerLayers = [];
  let activeBridge = null;

  function clearMarkers() {
    markerLayers.forEach(layer => map.removeLayer(layer));
    markerLayers = [];
  }

  function clearConnector() {
    while (svgLayer.firstChild) svgLayer.removeChild(svgLayer.firstChild);
  }

  function renderInfoCard(bridge, dynasty, totalCount) {
    if (!bridge) {
      infoCard.innerHTML = `<div class="empty-info">当前阶段暂无桥梁信息。</div>`;
      return;
    }

    infoCard.innerHTML = `
      <div class="bridge-info-name">
        ${bridge.name || "未命名桥梁"}
        ${isFeaturedBridge(bridge) ? '<span style="display:inline-block;margin-left:10px;font-size:14px;color:#E6C07B;">★重点桥梁</span>' : ''}
      </div>
      <div class="bridge-info-meta">
        <span class="bridge-meta-tag">${bridge.dynasty || "未知朝代"}</span>
        <span class="bridge-meta-tag">${bridge.type || "未知类型"}</span>
        <span class="bridge-meta-tag">${bridge.material || "未知建材"}</span>
      </div>
      <div class="bridge-info-text">
        <div>位置：${bridge.location || "未知"}</div>
        <div>批次：${bridge.batch || "未知"}</div>
        <div>年代：${bridge.year || "待考"}</div>
        <div style="margin-top:10px;">
          当前时间阶段为 <strong>${dynasty}</strong>，本阶段共展示 <strong>${totalCount}</strong> 条桥梁记录。
        </div>
      </div>
      <div class="bridge-info-action">
        <button class="ghost-btn light-border" id="viewDetailBtn">查看桥梁详情</button>
      </div>
    `;

    const viewDetailBtn = document.getElementById("viewDetailBtn");
    if (viewDetailBtn) {
      viewDetailBtn.addEventListener("click", () => {
        window.location.href = `bridge_detail.html?id=${bridge.id}`;
      });
    }
  }

  function drawConnectorToInfo(markerLatLng) {
    clearConnector();
    if (!markerLatLng) return;

    const point = map.latLngToContainerPoint(markerLatLng);
    const mapRect = mapWrap.getBoundingClientRect();

    const startX = point.x;
    const startY = point.y;
    const endX = mapRect.width - 22;
    const endY = Math.max(80, mapRect.height * 0.28);

    const polyline = document.createElementNS("http://www.w3.org/2000/svg", "path");
    polyline.setAttribute(
      "d",
      `M ${startX} ${startY} C ${startX + 80} ${startY}, ${endX - 120} ${endY}, ${endX} ${endY}`
    );
    polyline.setAttribute("class", "timeline-connector-line");
    svgLayer.appendChild(polyline);
  }

  function renderTimelineTypeChart(list, dynasty) {
    const typeCount = countBy(list.filter(item => item.type), item => item.type);
    const entries = sortedEntries(typeCount, true);
    const names = entries.map(item => item[0]).reverse();
    const values = entries.map(item => item[1]).reverse();

    typeChart.setOption({
      animationDuration: 900,
      animationEasing: "cubicOut",
      grid: { top: 18, left: 70, right: 26, bottom: 16, containLabel: true },
      tooltip: {
        trigger: "axis",
        axisPointer: { type: "shadow" },
        backgroundColor: "rgba(37,47,51,0.95)",
        borderColor: "rgba(199,164,106,0.16)",
        borderWidth: 1,
        textStyle: { color: "rgba(255,245,229,0.92)" }
      },
      xAxis: {
        type: "value",
        axisLine: { show: false },
        axisTick: { show: false },
        splitLine: { lineStyle: { color: chartColors.splitLineDark } },
        axisLabel: { color: chartColors.lightText }
      },
      yAxis: {
        type: "category",
        data: names,
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { color: chartColors.lightText }
      },
      series: [{
        type: "bar",
        data: values,
        barWidth: 16,
        itemStyle: {
          color: chartColors.accent,
          borderRadius: [0, 10, 10, 0]
        },
        label: {
          show: true,
          position: "right",
          color: "rgba(255,245,229,0.88)"
        }
      }]
    });

    caption.textContent = `当前展示阶段：${dynasty}。地图将聚焦该阶段桥梁分布区域，右侧显示当前代表桥梁信息，柱状图展示该阶段桥型构成。`;
  }

  function fitToGroup(list) {
    const valid = list.filter(item => item.lat && item.lng);
    if (!valid.length) {
      map.setView([35.2, 104.5], 4);
      return;
    }

    if (valid.length === 1) {
      map.flyTo([valid[0].lat, valid[0].lng], 7, { duration: 1.4 });
      return;
    }

    const bounds = L.latLngBounds(valid.map(item => [item.lat, item.lng]));
    map.flyToBounds(bounds, { padding: [60, 60], duration: 1.6 });
  }

  function activateBridge(bridge, marker) {
    activeBridge = bridge;
    renderInfoCard(bridge, bridge.dynasty || "未知", markerLayers.length);
    drawConnectorToInfo(marker.getLatLng());
  }

  function renderGroup(index) {
    currentIndex = index;
    slider.value = index;

    const group = timelineGroups[index];
    if (!group) return;

    const dynasty = group.dynasty;
    const list = group.bridges.filter(item => item.lat && item.lng);

    currentLabel.textContent = dynasty;
    badge.textContent = dynasty;

    clearMarkers();
    clearConnector();

    fitToGroup(list);

    let firstMarkerForInfo = null;

    list.forEach((bridge, idx) => {
      const finalStyle = getBridgeMarkerStyle(bridge, "timeline");

      const marker = L.circleMarker([bridge.lat, bridge.lng], {
        radius: 0,
        color: finalStyle.color,
        fillColor: finalStyle.fillColor,
        fillOpacity: finalStyle.fillOpacity,
        weight: finalStyle.weight
      }).addTo(map);

      marker.bindPopup(
        `<strong>${bridge.name || "未命名桥梁"}</strong>${isFeaturedBridge(bridge) ? ' <span style="color:#E6C07B;">★重点桥梁</span>' : ''}<br>` +
        `朝代：${bridge.dynasty || "未知"}<br>` +
        `类型：${bridge.type || "未知"}<br>` +
        `建材：${bridge.material || "未知"}`
      );

      markerLayers.push(marker);

      setTimeout(() => {
        marker.setRadius(finalStyle.radius);
      }, idx * 90);

      marker.on("click", () => {
        activateBridge(bridge, marker);
        window.location.href = `bridge_detail.html?id=${bridge.id}`;
      });

      marker.on("mouseover", () => {
        activateBridge(bridge, marker);
      });

      if (idx === 0) {
        firstMarkerForInfo = { bridge, marker };
      }
    });

    if (firstMarkerForInfo) {
      setTimeout(() => {
        activateBridge(firstMarkerForInfo.bridge, firstMarkerForInfo.marker);
      }, 420);
    } else {
      renderInfoCard(null, dynasty, 0);
    }

    renderTimelineTypeChart(list, dynasty);
    // 新增：更新桑基图数据
    const sankeyData = generateSankeyData(list);
    renderSankeyChart(sankeyChart, sankeyData, dynasty);
  }

  function nextFrame() {
    let next = currentIndex + 1;
    if (next >= timelineGroups.length) next = 0;
    renderGroup(next);
  }

  slider.addEventListener("input", e => {
    renderGroup(Number(e.target.value));
  });

  playPauseBtn.addEventListener("click", () => {
    isPlaying = !isPlaying;
    playPauseBtn.textContent = isPlaying ? "暂停" : "播放";

    if (isPlaying) {
      timer = setInterval(nextFrame, 2200);
    } else {
      clearInterval(timer);
    }
  });

  map.on("move", () => {
    if (activeBridge && activeBridge.lat && activeBridge.lng) {
      drawConnectorToInfo([activeBridge.lat, activeBridge.lng]);
    }
  });

  window.addEventListener("resize", () => {
    setTimeout(() => {
      map.invalidateSize();
      typeChart.resize();
      sankeyChart.resize(); // 新增：同步桑基图尺寸
      if (activeBridge && activeBridge.lat && activeBridge.lng) {
        drawConnectorToInfo([activeBridge.lat, activeBridge.lng]);
      }
    }, 200);
  });

  renderGroup(0);
}

async function initTypeSection() {
  const mapResult = await createChinaGeoMap("typeMap", [35.2, 104.5], 4);
  const typeMap = mapResult.map;

  const buttons = Array.from(document.querySelectorAll(".filter-btn"));
  const narrativeDom = document.getElementById("typeNarrative");
  let layers = [];

  function clearTypeLayers() {
    layers.forEach(layer => typeMap.removeLayer(layer));
    layers = [];
  }

  function renderType(type) {
    clearTypeLayers();

    const list = type === "全部"
      ? bridgeData
      : bridgeData.filter(item => (item.type || "").trim() === type);

    list.forEach(item => {
      if (!item.lat || !item.lng) return;

      const markerStyle = getBridgeMarkerStyle(item, "type");

      const marker = L.circleMarker([item.lat, item.lng], markerStyle)
        .bindPopup(
          `<strong>${item.name || "未命名桥梁"}</strong>${isFeaturedBridge(item) ? ' <span style="color:#A88447;">★重点桥梁</span>' : ''}<br>` +
          `朝代：${item.dynasty || "未知"}<br>` +
          `类型：${item.type || "未知"}`
        )
        .addTo(typeMap);

      layers.push(marker);
    });

    if (list.length) {
      const valid = list.filter(item => item.lat && item.lng);
      if (valid.length > 1) {
        typeMap.fitBounds(L.latLngBounds(valid.map(item => [item.lat, item.lng])), {
          padding: [50, 50]
        });
      } else if (valid.length === 1) {
        typeMap.flyTo([valid[0].lat, valid[0].lng], 7);
      }
    } else {
      typeMap.setView([35.2, 104.5], 4);
    }

    narrativeDom.textContent =
      type === "全部"
        ? "从整体看，桥梁类型与地域条件存在明显对应关系。平原水网、山地河谷、沿海与民族地区的桥梁形态差异，体现了材料来源、地形限制和社会功能需求的综合作用。"
        : getTypeNarrative(type);
  }

  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      buttons.forEach(item => item.classList.remove("active"));
      btn.classList.add("active");
      renderType(btn.dataset.type);
    });
  });

  renderType("全部");
}

  function initFeaturedSection() {
    const grid = document.getElementById("featuredGrid");
    const featured = bridgeData.filter(item => featuredNames.includes(item.name));

    if (!featured.length) {
      const fallback = bridgeData.slice(0, 8);
      renderCards(fallback);
      return;
    }

    renderCards(featured);

    function renderCards(list) {
      grid.innerHTML = "";
      list.forEach(item => {
        const card = document.createElement("div");
        card.className = "feature-card fade-in-up";
        card.innerHTML = `
          <div class="feature-title">${item.name || "未命名桥梁"}</div>
          <div class="feature-tags">
            <span class="feature-tag">${item.dynasty || "未知朝代"}</span>
            <span class="feature-tag">${item.type || "未知类型"}</span>
            <span class="feature-tag">${item.material || "未知建材"}</span>
          </div>
          <div class="feature-text">
            ${makeNarrative(item)}
          </div>
          <button class="feature-btn">进入详情</button>
        `;

        card.querySelector(".feature-btn").addEventListener("click", () => {
          window.location.href = `bridge_detail.html?id=${item.id}`;
        });

        grid.appendChild(card);
      });

      observeFadeIn();
    }
  }

  function initScrollButtons() {
    const startStoryBtn = document.getElementById("startStoryBtn");
    const backToTopBtn = document.getElementById("backToTopBtn");

    startStoryBtn.addEventListener("click", () => {
      document.getElementById("overview").scrollIntoView({ behavior: "smooth" });
    });

    backToTopBtn.addEventListener("click", () => {
      document.getElementById("hero").scrollIntoView({ behavior: "smooth" });
    });
  }

  function observeFadeIn() {
    const targets = document.querySelectorAll(".fade-in-up");
    if (!targets.length) return;

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15
    });

    targets.forEach(el => observer.observe(el));
  }

  function markSectionsForFade() {
    document.querySelectorAll(".section-head, .stat-card, .card, .card-dark, .ending-card").forEach(el => {
      el.classList.add("fade-in-up");
    });
  }

  async function initAll() {
  markSectionsForFade();
  initOverviewStats();
  await initOverviewMap();
  initOverviewCharts();
  await initTimelineSection();
  await initTypeSection();
  initFeaturedSection();
  initScrollButtons();
  observeFadeIn();
}

  document.addEventListener("DOMContentLoaded", () => {
    document.body.classList.add("page-loaded");
    initAll();
    });
})();