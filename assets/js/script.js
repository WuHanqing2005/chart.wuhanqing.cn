const airportList = document.getElementById('airport-list');
const pdfViewer = document.getElementById('pdf-viewer');
const languageSwitch = document.getElementById('language-switch');
let airports = [];

document.addEventListener('DOMContentLoaded', function () {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', './assets/js/files.json', true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                try {
                    airports = JSON.parse(xhr.responseText);
                    // Initialize airport list with all airports
                    generateAirportList('');
                    
                    // Alert success based on current language
                    if (isChinese) {
                        Swal.fire('成功', '机场列表已加载!', 'success');
                    } else {
                        Swal.fire('Success', 'Airport list loaded successfully.', 'success');
                    }
                } catch (e) {
                    // Alert error based on current language 
                    if (isChinese) {
                        Swal.fire('错误', '加载机场数据时发生错误!', 'error');
                    } else {
                        Swal.fire('Error', 'An error occurred while loading airport data.', 'error');
                    }
                }
            } else {
                // Alert error based on current language
                if (isChinese) {
                    Swal.fire('错误', '无法加载机场列表，请稍后再试!', 'error');
                } else {
                    Swal.fire('Error', 'Unable to load airport list, please try again later.', 'error');
                }
            }
        }
    };
    xhr.send();
});




let isChinese = false; // 默认显示英文

// 中英文切换按钮
function switchLanguage() {
    isChinese = !isChinese;
    languageSwitch.textContent = isChinese ? '中文' : 'English';
    generateAirportList(document.getElementById('search-box').value.toLowerCase());
}


// 翻译航图名称的函数，注意列表元素后不要缺英文逗号，不然会导致机场列表消失
function translatePageName(pageName) {
    const translations = {
        '-APDC': '-机场停机位置图',
        '-ADC': '-机场图',
        '-AD': '-机场数据',
        '-AOC': '-机场障碍物图',
        'ATCSMAC': '空中交通管制最低高度图',
        '-DGS': '-目视停靠引导系统',
        '-PATC': '-精密进近地形图',
        '-FDA': '-紧急放油区',
        'RWY': '跑道',
        '-SID': '-标准离场程序图',
        '-STAR': '-标准进场程序图',
        'RNAV': '区域导航进近',
        'RNP': '所需导航性能进近',
        '-IAC': '-仪表进近图',
        '-GMC': '-机场地面移动图',
        'ILS': 'ILS仪表着陆系统进近',
        'LOC': 'LOC航向道进近',
        'LDA': 'LDA直线进近',
        'ILS-DME': '仪表着陆系统进近',
        'VOR': 'VOR非精密进近',
        'VOR-DME': 'VOR非精密进近',
        'GLS': 'GLS地面增强着陆系统进近',
        'CAT-I-II-III': '一类/二类/三类',
        'CAT-I-II': '一类/二类',
        'CAT-II-III': '二类/三类',
        'CAT-I': '一类',
        'CAT-II': '二类',
        'CAT-III': '三类',

        'WAYPOINT LIST': '航路点坐标',
        'DATABASE CODING TABLE': '数据库编码表',
        'AIRPORT DATA': '机场数据',
        'AERODROME CHART': '机场图',
        'AERODROME OBSTRUCTION CHART': '机场障碍物图',
        'ATC SURVEILLANCE MINIMUM ALTITUDE CHART': '空中交通管制最低高度图',
        'DOCKING GUIDANCE SYSTEM': '目视停靠引导系统',
        'TAXIWAY': '滑行道',
        'FOR': '对于',
        'AERODROME SURFACE MOVEMENT CHART': '机场地面移动图',
        'AERODROME OBSTACLE CHART': '机场障碍物图',
        'PRECISION APPROACH TERRAIN CHART': '精密进近地形图',
        'DEPARTURE': '离场',
        'ARRIVAL': '进场',
        'FUEL DUMPING AREA': '紧急放油区',
        'AIRCRAFT PARKING CHART': '机场停机位置图',
        'TAXIING ROUTES CHART': '滑行路线图',
        'BY ATC': '经空中交通管制许可',
        'OPERATIONAL RULES': '操作规程',
        'TO NORTH': '去北侧',
        'TO SOUTH': '去南侧',
        'TO EAST': '去东侧',
        'TO WEST': '去西侧',

        'Aerodrome Chart': '机场图',
        'Aircraft Parking-Docking Chart': '机场停机位置图',
        'Aerodrome Obstacle Chart': '机场障碍物图',
        'type A': 'A型',
        'type B': 'B型',
        'type C': 'C型',
        'Precision Approach Terrain Chart': '精密进近地形图',
        'Standard Departure Chart - Instrument': '标准离场程序图',
        'Standard Departure Chart': '标准离场程序图',
        'Standard Arrival Chart - Instrument': '标准进场程序图',
        'Standard Arrival Chart': '标准进场程序图',
        'Instrument Approach Chart': '仪表进近图',
        'Other Chart': '其他图表',
        'VISUAL': '目视',
        'HIGHWAY': '高速公路',
        'HOLDING PATTERN': '标准等待程序',
        'ATTACHMENT': '附件',
    };

// 按照翻译列表的顺序进行替换
    for (const [key, value] of Object.entries(translations)) {
        pageName = pageName.replace(new RegExp(key, 'g'), value);
    }

    return pageName;
}

// 显示PDF的函数
function showPDF(pdfFile) {
    if (determineDevice() === 'Android') {
        var currentUrl = window.location.href;
        var pdfUrl = currentUrl.substring(0, currentUrl.lastIndexOf('/')) + '/' + pdfFile;
        var pdfFileEncoded = encodeURIComponent(pdfFile);
        pdfViewer.src = `/pdfviewer.html?url=${pdfFileEncoded}`;
    } else {
        pdfViewer.src = `${pdfFile}`;
    }

    // 更新页面上的文本内容以显示PDF文件的路径
    document.getElementById('pdf-path').textContent = `当前打开的PDF文件路径: ${pdfFile}`;
    document.getElementById('pdf-file-label').style.display = 'block'
    document.getElementById('pdf-file-content').style.display = 'block'
    document.getElementById('website-label').style.display = 'none'

    // 判断是否为移动端设备，如果是移动端，则点击PDF名称后，自动滚动到页面最底部
    if (isMobileDevice()) {
        // 滚动到页面最底部
        window.scrollTo({
            top: document.body.scrollHeight,
            behavior: 'auto' // 自动跳转
        });
    }
}

// 动态生成机场列表
function generateAirportList(query) {
    airportList.innerHTML = ''; // 清空当前列表
    airports.forEach(airport => {
        if (airport.name.toLowerCase().includes(query) || airport.folder.toLowerCase().includes(query)) {
            const airportItem = document.createElement('li');
            airportItem.classList.add('airport');
            airportItem.textContent = airport.name;
            airportItem.onclick = () => toggleSubList(airportItem);
            airportList.appendChild(airportItem);

            const subList = document.createElement('ul');
            subList.classList.add('sub-list');
            subList.style.display = 'none'; // 默认隐藏子列表
            airport.pages.forEach(page => {
                const pageItem = document.createElement('li');
                pageItem.textContent = isChinese ? translatePageName(page) : page;
                pageItem.onclick = () => showPDF(`./Terminal/${airport.folder}/${page}`);
                subList.appendChild(pageItem);
            });
            airportList.appendChild(subList);
        }
    });
}

// 点击机场名称时展开/折叠子页面
function toggleSubList(target) {
    const subList = target.nextElementSibling;
    if (subList.style.display === 'block') {
        subList.style.display = 'none'; // 折叠子列表
    } else {
        // 隐藏所有已展开的子列表
        const allSubLists = airportList.querySelectorAll('.sub-list');
        allSubLists.forEach(list => list.style.display = 'none');
        // 展开当前子列表
        subList.style.display = 'block';
    }
}

// 页面加载时检查并应用保存的主题
document.addEventListener('DOMContentLoaded', function () {
    const savedTheme = localStorage.getItem('theme') || 'light';
    const themeSwitch = document.getElementById('theme-switch');
    themeSwitch.value = savedTheme;
    document.documentElement.setAttribute('data-theme', savedTheme);
    languageSwitch.textContent = isChinese ? '中文' : 'English';

    // 初始化机场列表为折叠状态
    var xhr = new XMLHttpRequest();
    xhr.open('GET', './assets/js/files.json', true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                try {
                    airports = JSON.parse(xhr.responseText);
                    generateAirportList(''); // 调用修改后的函数，初始化列表为折叠状态
                    if (isChinese) {
                        Swal.fire('成功', '机场列表已加载!', 'success');
                    } else {
                        Swal.fire('Success', 'Airport list loaded successfully.', 'success');
                    }
                } catch (e) {
                    if (isChinese) {
                        Swal.fire('错误', '加载机场数据时发生错误!', 'error');
                    } else {
                        Swal.fire('Error', 'An error occurred while loading airport data.', 'error');
                    }
                }
            } else {
                if (isChinese) {
                    Swal.fire('错误', '无法加载机场列表，请稍后再试!', 'error');
                } else {
                    Swal.fire('Error', 'Unable to load airport list, please try again later.', 'error');
                }
            }
        }
    };
    xhr.send();
});

// 搜索功能
function filterList() {
    const query = document.getElementById('search-box').value.toLowerCase();
    generateAirportList(query);
}

// Determine Device
function determineDevice() {
    // Android
    if (navigator.userAgent.match(/Android/i)) {
        return 'Android';
    }

    // iOS / iPadOS / Mac
    if (navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/Mac/i)) {
        return 'Apple';
    }

    // Windows
    if (navigator.userAgent.match(/Windows/i)) {
        return 'Windows';
    }

    return 'Unknown';
}

// Function to determine if the device is a mobile device
function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// 主题切换功能
function switchTheme() {
    const themeSwitch = document.getElementById('theme-switch');
    const selectedTheme = themeSwitch.value;
    document.documentElement.setAttribute('data-theme', selectedTheme);
    localStorage.setItem('theme', selectedTheme);

    // 提示主题切换成功
    if (isChinese) {
        Swal.fire('成功', `已切换到${selectedTheme}主题`, 'success');
    } else {
        let themeName = '';
        switch (selectedTheme) {
            case 'light':
                themeName = 'Light';
                break;
            case 'dark':
                themeName = 'Dark';
                break;
            case 'bilibili':
                themeName = 'Bilibili';
                break;
            case 'win11':
                themeName = 'Win11';
                break;
            case 'coolapk':
                themeName = 'Coolapk';
                break;
            case 'gold':
                themeName = 'gold';
                break;
        }
        Swal.fire('Success', `Switched to ${themeName} theme`, 'success');
    }
}

// 返回到主页的函数
function resetToHomePage() {
    // 重置机场列表为初始状态（折叠）
    generateAirportList('');
    // 隐藏PDF查看器和路径显示
    document.getElementById('pdf-file-label').style.display = 'none';
    document.getElementById('pdf-file-content').style.display = 'none';
    // 显示网站标签信息
    document.getElementById('website-label').style.display = 'block';
    // 重置PDF查看器的源
    pdfViewer.src = '';
    // 提示用户已返回主页
    if (isChinese) {
        Swal.fire('成功', '已返回主页', 'success');
    } else {
        Swal.fire('Success', 'Returned to home page', 'success');
    }
}

// 页面加载完成后，为标题添加点击事件
document.addEventListener('DOMContentLoaded', function () {
    // 其他初始化代码

    // 为标题添加点击事件
    document.getElementById('title-header').addEventListener('click', resetToHomePage);
});

// 加载网页时，清空缓存
window.onload = function() {
    // 直接清空缓存
    localStorage.clear();
    sessionStorage.clear();
    // 清空 Cookie
    document.cookie = "";
};
