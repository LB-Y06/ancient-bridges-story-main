(function () {
  if (!Array.isArray(bridges)) {
    console.error("bridges_data.js 未正确加载。");
    return;
  }

  const params = new URLSearchParams(window.location.search);
  const id = Number(params.get("id"));
  const bridge = bridges.find(item => Number(item.id) === id) || bridges[0];

  const nameDom = document.getElementById("detailName");
  const dynastyDom = document.getElementById("detailDynasty");
  const typeDom = document.getElementById("detailType");
  const materialDom = document.getElementById("detailMaterial");
  const locationDom = document.getElementById("detailLocation");
  const batchDom = document.getElementById("detailBatch");
  const yearDom = document.getElementById("detailYear");
  const idDom = document.getElementById("detailId");

  const summaryDom = document.getElementById("detailSummary");
  const quoteDom = document.getElementById("detailQuote");
  const narrativeDom = document.getElementById("detailNarrative");
  const structureDom = document.getElementById("detailStructure");
  const regionDom = document.getElementById("detailRegion");
  const cultureDom = document.getElementById("detailCulture");
  const sideTagsDom = document.getElementById("detailSideTags");

  const detailColorMap = {
    "拱桥": "#5A6D74",
    "梁桥": "#9C6B3F",
    "廊桥": "#6A7B5B"
  };

  const featuredBridgeContent = {
  58: {
    summary: "安济桥（大石桥）是中国古代石拱桥技术发展中的代表性作品，也是中国古桥史上极具标志性的工程遗产。它不仅以结构轻巧、受力合理著称，更常被视为中国古代桥梁技术成熟的重要象征。",
    quote: "在中国古桥史中，安济桥常被视作石拱桥技术高度成熟的标志性实例。",
    narrative: "安济桥位于今河北地区，始建于隋代，是中国现存古桥中最具代表性的石拱桥之一。若从中国桥梁发展史来看，它的重要性并不只在于年代较早，更在于其结构体系展现出高度成熟的工程思维。它所体现的，不是简单的跨水行为，而是一种对材料性能、结构受力和实际通行需求的综合把握。",
    structure: "安济桥最突出的结构特点是单孔敞肩式石拱设计。主拱券承担主要荷载，两侧小拱既减轻桥体自重，也有助于泄洪和缓解桥身压力。这种做法体现出古代工匠对于石材抗压性能和桥梁整体受力关系的深刻理解，也使安济桥在桥梁结构史上具有极高地位。",
    region: "河北地区地势相对开阔，水道与交通联系的需求使桥梁建设具有较强现实意义。安济桥所处区域既连接南北交通，也承担地方通行功能，因此桥梁不仅是地方基础设施的一部分，也嵌入了更大的区域交通网络之中。",
    culture: "安济桥的文化意义在于，它常被视作中国古代工程智慧的象征之一。它以简洁而高效的结构形式跨越时代，在今天仍然作为中国古桥技术成就的重要代表被反复讨论。对可视化作品而言，它能够作为“古桥技术成熟”的关键个案，帮助观众从单一对象理解整个时代的桥梁水平。"
  },

  68: {
    summary: "洛阳桥是中国古代大型跨海湾石梁桥中的代表案例，体现了古代桥梁工程在复杂水文条件下的适应能力，也反映出海滨地区交通组织与桥梁技术之间的密切联系。",
    quote: "洛阳桥的重要性，在于它把桥梁建设推进到了更复杂的滨海水域环境中。",
    narrative: "洛阳桥位于福建泉州一带，是宋代以来极具代表性的桥梁遗产之一。相较于一般内陆河桥，洛阳桥更值得关注的是其所面对的环境条件：潮汐、水流、软基与滨海交通需求，使它成为中国古代桥梁工程中兼具挑战性与代表性的个案。",
    structure: "洛阳桥的结构亮点在于大型石梁桥体系及其基础处理经验。古代工匠需要解决的不只是“把桥架起来”，更是如何在复杂水域中稳定桥基、组织桥墩、保证长期通行。它体现的是整体性工程组织，而不仅是单一构件的巧妙。",
    region: "泉州及其周边地区在古代海上交通和区域交流中地位突出，桥梁建设与港口、商贸、聚落联系密切。洛阳桥所在区域的水网和海湾环境，使桥梁成为区域空间组织的重要节点，也赋予其更强的交通与经济意义。",
    culture: "洛阳桥不仅是交通工程，也是一种区域历史记忆。它折射出宋代东南沿海经济活跃、工程组织能力增强以及桥梁建设与社会发展相互支撑的历史背景。在你的作品中，它适合被放在“复杂环境中的古桥技术”这一主题下重点讲述。"
  },

  69: {
    summary: "广济桥是中国古代桥梁中兼具交通功能、组合结构特征与景观价值的重要个案，其独特之处在于桥梁并非单一固定形态，而是体现出更复杂的桥梁组织方式。",
    quote: "广济桥的魅力，不仅在于跨水通行，更在于它呈现出一种复合性的桥梁空间。",
    narrative: "广济桥位于广东潮州，是中国古桥中辨识度极高的一座。它不同于单纯的石拱桥或单一梁桥，而是以更复杂的桥梁组合形式著称，因此常被视作中国古桥中极具个性和地域特征的代表对象。",
    structure: "广济桥的亮点在于桥梁形态的复合性。它并不是一种单一结构逻辑从头到尾完全统一的桥，而是在桥墩、桥面组织和通行方式上体现出更灵活的适应性。这种复合结构使它在桥梁史中占据特殊位置，也让它具有很强的展示价值。",
    region: "潮州地处韩江流域，桥梁建设与城市发展、水陆交通组织紧密相关。广济桥正是在区域交通和城市空间需求下形成的重要节点，因此它不仅属于工程遗产，也属于城市历史景观的一部分。",
    culture: "广济桥兼具工程价值、景观价值和文化象征意义。在很多观众眼中，它已经不只是“桥”，而是一种具有地方标识性的文化地标。在你的作品里，它适合承担“桥梁空间复合性与地域文化展示”的角色。"
  },

  285: {
    summary: "宝带桥是江南地区古桥景观与石拱桥技术结合的代表个案，其长桥形态和多孔连续拱特征，使它在中国古代桥梁中具有较高辨识度。",
    quote: "宝带桥像一条横跨水面的石带，将江南水乡的桥梁景观推向了极具诗意的层面。",
    narrative: "宝带桥位于苏州，是江南地区极具代表性的古桥之一。它既体现出古代桥梁通行功能的现实需求，也因桥体形态优美、与周边水乡环境协调而具有鲜明的景观特征。",
    structure: "宝带桥的重要结构特点在于多孔连续拱形式。连续的拱券组织既适应较长桥身跨越需求，也形成了极具节奏感的桥体轮廓。石材的运用使整座桥在功能与审美之间达成平衡，体现了江南古桥常见的技术与景观统一。",
    region: "苏州所在的江南水网地区河道纵横、圩田密布，桥梁在地方交通系统中极其重要。宝带桥正是在这种水乡环境中形成的，其长桥特征与区域地貌、水系组织密不可分。",
    culture: "宝带桥的文化意义不仅在工程层面，也在审美层面。它常被视作江南古桥景观的重要代表，在你的作品中很适合承担“水乡桥梁空间意象”的展示功能，让观众从中理解中国古桥不仅服务通行，也深度参与地方景观塑造。"
  },

  41: {
    summary: "程阳永济桥是侗族地区桥梁建筑中兼具交通功能与公共空间意义的典型个案，也是风雨桥/廊桥系统中最具代表性的对象之一。",
    quote: "程阳永济桥说明，桥梁在某些地区从来不只是“过河的设施”，更是生活空间的一部分。",
    narrative: "程阳永济桥位于广西三江侗族自治县，是侗族地区极具代表性的风雨桥个案。与常见石拱桥不同，它更能体现桥梁与地方木构传统、聚落生活和民族文化之间的紧密联系。",
    structure: "程阳永济桥的突出特点在于木构廊桥体系。桥面上覆以廊屋，不仅增强使用舒适性，也使桥梁具备停留、交往和公共活动的空间属性。这种结构形式超越了单纯跨越功能，体现了桥梁与建筑空间的融合。",
    region: "广西侗族聚居地区山地与河谷环境明显，桥梁往往与村寨交通、地方木作技术和区域环境条件深度结合。程阳永济桥正是在这种地域背景下形成的，因此其空间意义远大于普通通行设施。",
    culture: "程阳永济桥的文化意义非常突出。它既是桥梁工程，也是民族建筑与地方生活方式的综合体现。在你的作品中，这座桥非常适合作为“桥梁公共性与地域文化结合”的重点案例。"
  },

  558: {
    summary: "泰顺廊桥代表了浙南山区木拱廊桥体系的独特传统，是中国古桥中兼具工艺性、地域性与文化性的典型个案。",
    quote: "在浙南山区，廊桥不是附属现象，而是一整套成熟的地方桥梁传统。",
    narrative: "泰顺廊桥并非单一一座桥的名称，而是浙南地区廊桥系统的重要代表。它所体现的并不是一种偶然出现的地方样式，而是一种在山区环境、木构工艺和地方交通需求中长期发展出来的桥梁传统。",
    structure: "泰顺廊桥的亮点在于木拱与廊屋空间的结合。木构桥梁需要更精细的节点组织和工艺经验，而廊屋的加入又进一步强化了桥梁的空间使用价值。这种复合形式使其在中国古桥中非常独特。",
    region: "浙南山区河谷密布，交通联系常受到地形制约。廊桥正是在这种环境中发展起来的，既满足跨越需求，也适应地方材料获取和工艺传统。泰顺廊桥因此成为理解山区桥梁文化的重要入口。",
    culture: "泰顺廊桥的意义在于，它让观众看到桥梁可以成为一种高度地方化的技术与文化系统。它不仅是桥，更是一种区域建筑传统和地方社会生活方式的显现。"
  },

  758: {
    summary: "双龙桥是西南地区桥梁景观与工程结合的典型案例，其复杂造型与空间布局体现了地方桥梁建造的独特性。",
    quote: "双龙桥让桥梁从工程结构转变为可被观看的空间形象。",
    narrative: "双龙桥位于云南建水，是中国古桥中极具视觉特色的一座。它不仅承担通行功能，更在形态上呈现出高度的装饰性和空间复杂性。",
    structure: "双龙桥由多个桥段组合而成，结构并非单一逻辑，而是复合式组织。这种形式体现了桥梁在满足通行之外的空间表达需求。",
    region: "云南地区桥梁多与山地环境、水系和民族文化结合。双龙桥正是在这种背景下形成，具有明显的地域特征。",
    culture: "双龙桥的意义在于，它打破了“桥只是功能结构”的认知，展示了桥梁作为文化景观的重要价值。在你的作品中，它适合作为“桥梁造型与视觉表达”的代表。"
  }
};

  function getPointColor(type) {
    return detailColorMap[type] || "#A38E72";
  }

  function getBridgeSummary(item) {
    return `${item.name || "该桥"}位于${item.location || "未知地区"}，现有数据中将其归入${item.dynasty || "未知朝代"}，类型为${item.type || "未知类型"}，建材以${item.material || "未知"}为主。作为中国古代桥梁网络中的个案，它不仅具有交通层面的意义，也体现了特定区域在材料利用、结构选择和环境适应方面的历史经验。`;
  }

  function getBridgeQuote(item) {
    return `从 ${item.dynasty || "未知时代"} 到地方空间，${item.name || "这座桥"}既是交通节点，也是工程智慧与地域文化的凝结。`;
  }

  function getBridgeNarrative(item) {
    const yearText = item.year ? `${item.year}年前后` : "具体年代待考";
    return `${item.name || "该桥"}可被视作中国古代桥梁发展中的一个空间切片。它所在位置为${item.location || "未知地区"}，在现有资料中被归入${item.dynasty || "未知朝代"}，年代信息可概括为${yearText}。若将其放回更大的桥梁时空格局中观察，这座桥并不是孤立的建筑遗存，而是与区域交通、水文条件、材料获取和地方工艺传统共同构成的历史结果。`;
  }

  function getStructureNarrative(item) {
    const type = item.type || "";
    const material = item.material || "未知材料";

    if (type === "拱桥") {
      return `${item.name || "该桥"}属于拱桥类型。拱桥以拱圈为主要承重结构，在受力上以压力传递为主，能够较好发挥石材等材料的抗压性能。其结构逻辑稳定、跨越能力较强，因此在中国古代桥梁体系中具有代表性。结合本桥以${material}为主要建材这一点，可以进一步理解古代工匠如何通过结构形式与材料性能的匹配，实现跨水交通的长期稳定。`;
    }

    if (type === "梁桥") {
      return `${item.name || "该桥"}属于梁桥类型。梁桥通常以水平梁体直接承重，结构关系明确，构造方式相对直接，是中国古代桥梁中较早出现、也较常见的一类形式。若本桥以${material}为主要材料，则更能体现其在地方材料条件、施工方式与桥梁尺度之间的平衡。`;
    }

    if (type === "廊桥") {
      return `${item.name || "该桥"}可归入廊桥系统。廊桥并不仅仅承担通行功能，其带廊屋的空间形式使桥梁兼具遮风避雨、停留休憩乃至公共交流的作用。若结合${material}这一材料特征来看，本桥更能体现地方木作传统、山区桥梁营建经验以及桥梁与日常生活空间相结合的复合属性。`;
    }

    return `${item.name || "该桥"}的结构类型为${type || "未知类型"}。从桥梁史和工程角度看，这类桥梁的形成往往与跨越需求、材料条件和地方建造经验紧密相关。结合其以${material}为主要建材这一点，可以从结构受力与材料适配关系出发，进一步理解其工程特征。`;
  }

  function getRegionNarrative(item) {
    return `${item.name || "该桥"}位于${item.location || "未知地区"}。从中国古桥的空间分布格局来看，不同区域在桥梁类型、建材选择和保存形态上存在明显差异。这种差异与地形地貌、水系发育程度、地方资源条件以及区域交通网络演变密切相关。将本桥放在所在地区中考察，有助于理解它为何以当前的桥型和材料形式出现，以及它在地方历史空间中的位置。`;
  }

  function getCultureNarrative(item) {
    return `古桥的价值并不止于跨越河流沟壑。${item.name || "该桥"}作为历史遗存，也承载着地方社会记忆、工匠经验与文化景观意义。它既是工程技术的产物，也是地方生活世界的一部分。对于今天的可视化展示而言，这类桥梁的重要性在于：它能够将抽象的朝代、地区与桥型统计，落实为一个可被感知和理解的具体对象。`;
  }

  function buildSideTags(item) {
    const tags = [
      item.dynasty || "未知朝代",
      item.type || "未知类型",
      item.material || "未知建材",
      item.location || "未知地区",
      item.batch || "未知批次"
    ].filter(Boolean);

    sideTagsDom.innerHTML = "";
    tags.forEach(tag => {
      const span = document.createElement("span");
      span.className = "detail-side-tag";
      span.textContent = tag;
      sideTagsDom.appendChild(span);
    });
  }

  function fillDetail(item) {
    if (!item) return;

    document.title = `${item.name || "古桥"} · 详情`;

    nameDom.textContent = item.name || "未命名桥梁";
    dynastyDom.textContent = item.dynasty || "未知朝代";
    typeDom.textContent = item.type || "未知类型";
    materialDom.textContent = item.material || "未知建材";

    locationDom.textContent = item.location || "未知";
    batchDom.textContent = item.batch || "未知";
    yearDom.textContent = item.year || "待考";
    idDom.textContent = item.id || "—";

    const customContent = featuredBridgeContent[item.id];

    summaryDom.textContent = customContent?.summary || getBridgeSummary(item);
    quoteDom.textContent = customContent?.quote || getBridgeQuote(item);
    narrativeDom.textContent = customContent?.narrative || getBridgeNarrative(item);
    structureDom.textContent = customContent?.structure || getStructureNarrative(item);
    regionDom.textContent = customContent?.region || getRegionNarrative(item);
    cultureDom.textContent = customContent?.culture || getCultureNarrative(item);

    buildSideTags(item);
  }

async function initMap(item) {
  const map = L.map("detailMap", {
    zoomControl: false,
    attributionControl: false,
    minZoom: 3,
    maxZoom: 8
  }).setView([35.2, 104.5], 4);

  const response = await fetch("assets/geo/china-provinces.geojson");
  const chinaGeoJson = await response.json();

  const geoLayer = L.geoJSON(chinaGeoJson, {
    style: function () {
      return {
        color: "rgba(150, 125, 88, 0.55)",
        weight: 1,
        fillColor: "rgba(231, 220, 203, 0.85)",
        fillOpacity: 0.95
      };
    }
  }).addTo(map);

  map.fitBounds(geoLayer.getBounds(), {
    padding: [20, 20]
  });

  if (item && item.lat && item.lng) {
    const pointColor = getPointColor(item.type);

    L.circleMarker([item.lat, item.lng], {
      radius: 8,
      color: pointColor,
      fillColor: pointColor,
      fillOpacity: 0.84,
      weight: 1.6
    })
      .bindPopup(`<strong>${item.name || "未命名桥梁"}</strong>`)
      .addTo(map)
      .openPopup();

    map.flyTo([item.lat, item.lng], 7, { duration: 1.4 });
  }
}

  function initFadeIn() {
    const targets = document.querySelectorAll(".fade-in-up");
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12
    });

    targets.forEach(el => observer.observe(el));
  }

  document.getElementById("backHomeBtn").addEventListener("click", () => {
    window.location.href = "index.html";
  });

  fillDetail(bridge);
  initMap(bridge);
  initFadeIn();
})();