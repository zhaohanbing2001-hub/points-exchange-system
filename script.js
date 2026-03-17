// 地址数据
const addressData = {
    "北京市": {
        "北京市": ["东城区", "西城区", "朝阳区", "海淀区", "丰台区", "石景山区", "门头沟区", "房山区", "通州区", "顺义区", "昌平区", "大兴区", "怀柔区", "平谷区", "密云区", "延庆区"]
    },
    "上海市": {
        "上海市": ["黄浦区", "徐汇区", "长宁区", "静安区", "普陀区", "虹口区", "杨浦区", "浦东新区", "闵行区", "宝山区", "嘉定区", "金山区", "松江区", "青浦区", "奉贤区", "崇明区"]
    },
    "广东省": {
        "广州市": ["越秀区", "海珠区", "荔湾区", "天河区", "白云区", "黄埔区", "番禺区", "花都区", "南沙区", "从化区", "增城区"],
        "深圳市": ["罗湖区", "福田区", "南山区", "宝安区", "龙岗区", "盐田区", "龙华区", "坪山区", "光明区", "大鹏新区"]
    },
    "浙江省": {
        "杭州市": ["上城区", "下城区", "江干区", "拱墅区", "西湖区", "滨江区", "萧山区", "余杭区", "富阳区", "临安区", "桐庐县", "淳安县", "建德市"],
        "宁波市": ["海曙区", "江北区", "北仑区", "镇海区", "鄞州区", "奉化区", "象山县", "宁海县", "余姚市", "慈溪市"]
    }
};

// 奖励数据
const rewards = [
    {
        id: 1,
        name: "精美笔记本",
        description: "高质量纸质笔记本，适合日常使用",
        points: 100,
        image: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=high%20quality%20notebook%20with%20pen&image_size=square"
    },
    {
        id: 2,
        name: "品牌水杯",
        description: "保温性能良好的品牌水杯",
        points: 200,
        image: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=brand%20thermos%20water%20bottle&image_size=square"
    },
    {
        id: 3,
        name: "无线耳机",
        description: "高品质无线蓝牙耳机",
        points: 500,
        image: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=wireless%20bluetooth%20earphones&image_size=square"
    },
    {
        id: 4,
        name: "运动背包",
        description: "轻便耐用的运动背包",
        points: 300,
        image: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=sports%20backpack%20lightweight&image_size=square"
    },
    {
        id: 5,
        name: "手机支架",
        description: "多功能手机支架",
        points: 50,
        image: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=multi%20function%20phone%20stand&image_size=square"
    },
    {
        id: 6,
        name: " USB 数据线",
        description: "高速传输 USB 数据线",
        points: 80,
        image: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=USB%20data%20cable%20high%20speed&image_size=square"
    }
];

// 初始化数据
let userPoints = 10000;
let exchangeHistory = [];

// 从本地存储加载数据
function loadData() {
    const savedPoints = localStorage.getItem('userPoints');
    const savedHistory = localStorage.getItem('exchangeHistory');
    
    if (savedPoints) {
        userPoints = parseInt(savedPoints);
    }
    
    if (savedHistory) {
        exchangeHistory = JSON.parse(savedHistory);
    }
}

// 保存数据到本地存储
function saveData() {
    localStorage.setItem('userPoints', userPoints.toString());
    localStorage.setItem('exchangeHistory', JSON.stringify(exchangeHistory));
}

// 渲染用户积分
function renderUserPoints() {
    document.getElementById('user-points').textContent = userPoints;
}

// 显示图片查看模态框
function showImageModal(imageUrl) {
    const modal = document.getElementById('image-modal');
    const modalImage = document.getElementById('modal-image');
    modalImage.src = imageUrl;
    modal.style.display = 'block';
}

// 渲染奖励项目
function renderRewards() {
    const rewardsGrid = document.getElementById('rewards-grid');
    rewardsGrid.innerHTML = '';
    
    rewards.forEach(reward => {
        const rewardItem = document.createElement('div');
        rewardItem.className = 'reward-item';
        
        rewardItem.innerHTML = `
            <img src="${reward.image}" alt="${reward.name}" data-image="${reward.image}">
            <h3>${reward.name}</h3>
            <p>${reward.description}</p>
            <div class="reward-points">${reward.points} 积分</div>
            <button class="exchange-btn" data-id="${reward.id}" ${userPoints < reward.points ? 'disabled' : ''}>
                ${userPoints < reward.points ? '积分不足' : '立即兑换'}
            </button>
        `;
        
        rewardsGrid.appendChild(rewardItem);
    });
    
    // 添加兑换按钮事件监听
    document.querySelectorAll('.exchange-btn').forEach(btn => {
        btn.addEventListener('click', handleExchange);
    });
    
    // 添加图片点击事件监听
    document.querySelectorAll('.reward-item img').forEach(img => {
        img.addEventListener('click', function() {
            const imageUrl = this.dataset.image;
            showImageModal(imageUrl);
        });
    });
}

// 渲染兑换历史
function renderHistory() {
    const historyList = document.getElementById('history-list');
    historyList.innerHTML = '';
    
    if (exchangeHistory.length === 0) {
        const emptyItem = document.createElement('li');
        emptyItem.textContent = '暂无兑换记录';
        emptyItem.style.cursor = 'default';
        emptyItem.style.backgroundColor = 'transparent';
        historyList.appendChild(emptyItem);
        return;
    }
    
    exchangeHistory.forEach((item, index) => {
        const historyItem = document.createElement('li');
        historyItem.className = 'history-item';
        
        historyItem.innerHTML = `
            <span class="reward-name">${item.rewardName}</span>
            <span class="exchange-date">${item.date}</span>
        `;
        
        // 添加点击事件，显示详情
        historyItem.addEventListener('click', () => showHistoryDetail(index));
        
        historyList.appendChild(historyItem);
    });
}

// 显示兑换历史模态框
function showHistoryModal() {
    renderHistory();
    document.getElementById('history-modal').style.display = 'block';
}

// 显示兑换详情模态框
function showHistoryDetail(index) {
    const item = exchangeHistory[index];
    if (!item) return;
    
    const detailContent = document.getElementById('history-detail-content');
    detailContent.innerHTML = `
        <div class="detail-item">
            <div class="detail-label">奖励名称</div>
            <div class="detail-value">${item.rewardName}</div>
        </div>
        <div class="detail-item">
            <div class="detail-label">兑换时间</div>
            <div class="detail-value">${item.date}</div>
        </div>
        <div class="detail-item">
            <div class="detail-label">收货信息</div>
            <div class="detail-value">${item.address || '无地址信息'}</div>
        </div>
    `;
    
    document.getElementById('history-detail-modal').style.display = 'block';
}

// 关闭指定模态框
function closeSpecificModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
    
    // 如果是地址模态框，重置表单
    if (modalId === 'address-modal') {
        document.getElementById('address-form').reset();
        document.getElementById('city').disabled = true;
        document.getElementById('district').disabled = true;
    }
}

// 处理兑换逻辑
function handleExchange(e) {
    const rewardId = parseInt(e.target.dataset.id);
    const reward = rewards.find(r => r.id === rewardId);
    
    if (!reward) return;
    
    if (userPoints >= reward.points) {
        // 显示收货地址模态框
        document.getElementById('reward-id').value = rewardId;
        document.getElementById('address-modal').style.display = 'block';
    } else {
        alert('积分不足，无法兑换');
    }
}

// 初始化地址选择器
function initAddressSelector() {
    const provinceSelect = document.getElementById('province');
    const citySelect = document.getElementById('city');
    const districtSelect = document.getElementById('district');
    
    // 填充省份
    for (const province in addressData) {
        const option = document.createElement('option');
        option.value = province;
        option.textContent = province;
        provinceSelect.appendChild(option);
    }
    
    // 省份选择事件
    provinceSelect.addEventListener('change', function() {
        const selectedProvince = this.value;
        citySelect.innerHTML = '<option value="">请选择城市</option>';
        districtSelect.innerHTML = '<option value="">请选择区县</option>';
        
        if (selectedProvince) {
            citySelect.disabled = false;
            
            // 填充城市
            for (const city in addressData[selectedProvince]) {
                const option = document.createElement('option');
                option.value = city;
                option.textContent = city;
                citySelect.appendChild(option);
            }
        } else {
            citySelect.disabled = true;
            districtSelect.disabled = true;
        }
    });
    
    // 城市选择事件
    citySelect.addEventListener('change', function() {
        const selectedProvince = provinceSelect.value;
        const selectedCity = this.value;
        districtSelect.innerHTML = '<option value="">请选择区县</option>';
        
        if (selectedCity) {
            districtSelect.disabled = false;
            
            // 填充区县
            const districts = addressData[selectedProvince][selectedCity];
            districts.forEach(district => {
                const option = document.createElement('option');
                option.value = district;
                option.textContent = district;
                districtSelect.appendChild(option);
            });
        } else {
            districtSelect.disabled = true;
        }
    });
}

// 处理地址表单提交
function handleAddressSubmit(e) {
    e.preventDefault();
    
    const rewardId = parseInt(document.getElementById('reward-id').value);
    const reward = rewards.find(r => r.id === rewardId);
    
    if (!reward) return;
    
    // 获取地址信息
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const province = document.getElementById('province').value;
    const city = document.getElementById('city').value;
    const district = document.getElementById('district').value;
    const detailAddress = document.getElementById('detail-address').value;
    
    // 构建完整地址
    const fullAddress = `${province} ${city} ${district} ${detailAddress}`;
    
    // 扣除积分
    userPoints -= reward.points;
    
    // 添加到兑换历史
    const exchangeItem = {
        rewardName: reward.name,
        date: new Date().toLocaleString('zh-CN'),
        address: `${name}, ${phone}, ${fullAddress}`
    };
    exchangeHistory.unshift(exchangeItem);
    
    // 保存数据
    saveData();
    
    // 更新 UI
    renderUserPoints();
    renderRewards();
    renderHistory();
    
    // 关闭模态框
    document.getElementById('address-modal').style.display = 'none';
    
    // 重置表单
    document.getElementById('address-form').reset();
    
    // 重置地址选择器状态
    document.getElementById('city').disabled = true;
    document.getElementById('district').disabled = true;
    
    // 显示成功提示
    alert(`兑换成功！您已成功兑换 ${reward.name}，我们将尽快为您发货`);
}

// 关闭指定模态框
function closeModal(modalId) {
    // 如果没有指定模态框，关闭所有模态框
    if (!modalId) {
        document.getElementById('address-modal').style.display = 'none';
        document.getElementById('history-modal').style.display = 'none';
        document.getElementById('history-detail-modal').style.display = 'none';
        document.getElementById('image-modal').style.display = 'none';
        
        // 重置地址表单
        document.getElementById('address-form').reset();
        document.getElementById('city').disabled = true;
        document.getElementById('district').disabled = true;
    } else {
        // 只关闭指定的模态框
        document.getElementById(modalId).style.display = 'none';
        
        // 如果关闭的是地址模态框，重置表单
        if (modalId === 'address-modal') {
            document.getElementById('address-form').reset();
            document.getElementById('city').disabled = true;
            document.getElementById('district').disabled = true;
        }
    }
}

// 点击模态框外部关闭
window.onclick = function(event) {
    const modals = ['address-modal', 'history-modal', 'history-detail-modal', 'image-modal'];
    modals.forEach(modalId => {
        const modal = document.getElementById(modalId);
        if (event.target == modal) {
            closeModal(modalId);
        }
    });
}

// 初始化应用
function init() {
    loadData();
    renderUserPoints();
    renderRewards();
    
    // 初始化地址选择器
    initAddressSelector();
    
    // 添加事件监听器
    document.getElementById('address-form').addEventListener('submit', handleAddressSubmit);
    document.getElementById('history-btn').addEventListener('click', showHistoryModal);
    
    // 为所有关闭按钮添加事件监听器
    document.querySelectorAll('.close').forEach(btn => {
        btn.addEventListener('click', function() {
            // 找到当前关闭按钮所在的模态框
            const modal = this.closest('.modal');
            if (modal) {
                closeModal(modal.id);
            }
        });
    });
}

// 启动应用
init();