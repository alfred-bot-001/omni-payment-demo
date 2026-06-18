const terminalOutput = document.getElementById("terminalOutput");
const terminalForm = document.getElementById("terminalForm");
const terminalInput = document.getElementById("terminalInput");
const walletStatus = document.getElementById("walletStatus");
const publishDemo = document.getElementById("publishDemo");
const publishOutput = document.getElementById("publishOutput");
const publishForm = document.getElementById("publishForm");
const publishInput = document.getElementById("publishInput");
const publishQuick = document.getElementById("publishQuick");
const publishStatus = document.getElementById("publishStatus");
const checkoutDemo = document.getElementById("checkoutDemo");
const checkoutOutput = document.getElementById("checkoutOutput");
const checkoutForm = document.getElementById("checkoutForm");
const checkoutInput = document.getElementById("checkoutInput");
const checkoutQuick = document.getElementById("checkoutQuick");
const openMerchantSite = document.getElementById("openMerchantSite");
const testWebPayment = document.getElementById("testWebPayment");
const merchantStatus = document.getElementById("merchantStatus");
const merchantSiteModal = document.getElementById("merchantSiteModal");
const closeMerchantSite = document.getElementById("closeMerchantSite");
const binanceCheckoutModal = document.getElementById("binanceCheckoutModal");
const closeBinanceCheckout = document.getElementById("closeBinanceCheckout");
const confirmCheckoutPay = document.getElementById("confirmCheckoutPay");
const checkoutResult = document.getElementById("checkoutResult");
const checkoutMerchant = document.getElementById("checkoutMerchant");
const checkoutAmount = document.getElementById("checkoutAmount");
const walletCheckoutMerchant = document.getElementById("walletCheckoutMerchant");
const walletCheckoutAmount = document.getElementById("walletCheckoutAmount");
const checkoutAddress = document.getElementById("checkoutAddress");
const checkoutLoginStep = document.getElementById("checkoutLoginStep");
const checkoutWalletStep = document.getElementById("checkoutWalletStep");
const checkoutSuccessStep = document.getElementById("checkoutSuccessStep");
const checkoutLoginBtn = document.getElementById("checkoutLoginBtn");
const closeCheckoutSuccess = document.getElementById("closeCheckoutSuccess");
const checkoutSuccessText = document.getElementById("checkoutSuccessText");

const authModal = document.getElementById("authModal");
const closeAuth = document.getElementById("closeAuth");
const loginStep = document.getElementById("loginStep");
const permissionStep = document.getElementById("permissionStep");
const successStep = document.getElementById("successStep");
const loginBtn = document.getElementById("loginBtn");
const confirmAuth = document.getElementById("confirmAuth");
const returnTerminal = document.getElementById("returnTerminal");

let walletBound = false;
let countdownTimer = null;
let countdownLeft = 30;
let paymentRejected = false;
let paymentCompleted = false;
let flowRunning = false;
let publishRunning = false;
let checkoutRunning = false;

const roleMap = {
  user: "›",
  assistant: "⏺",
  system: "⏺",
  tool: "⎿",
  success: "✓",
  warn: "!",
  dim: "·"
};

function appendLine(text, type = "assistant") {
  const message = document.createElement("div");
  message.className = `message ${type}`;
  const role = document.createElement("div");
  role.className = "role";
  role.textContent = roleMap[type] || "⏺";
  const content = document.createElement("div");
  content.className = "content";
  const paragraph = document.createElement("p");
  paragraph.textContent = text;
  content.appendChild(paragraph);
  message.append(role, content);
  terminalOutput.appendChild(message);
  terminalOutput.scrollTop = terminalOutput.scrollHeight;
}

function appendHTML(html) {
  const wrapper = document.createElement("div");
  wrapper.className = "message tool";
  wrapper.innerHTML = `<div class="role">⎿</div><div class="content">${html}</div>`;
  terminalOutput.appendChild(wrapper);
  terminalOutput.scrollTop = terminalOutput.scrollHeight;
  return wrapper;
}

function appendCheckoutLine(text, type = "assistant") {
  const message = document.createElement("div");
  message.className = `message ${type}`;
  const role = document.createElement("div");
  role.className = "role";
  role.textContent = roleMap[type] || "⏺";
  const content = document.createElement("div");
  content.className = "content";
  const paragraph = document.createElement("p");
  paragraph.textContent = text;
  content.appendChild(paragraph);
  message.append(role, content);
  checkoutOutput.appendChild(message);
  checkoutOutput.scrollTop = checkoutOutput.scrollHeight;
}

function appendPublishLine(text, type = "assistant") {
  const message = document.createElement("div");
  message.className = `message ${type}`;
  const role = document.createElement("div");
  role.className = "role";
  role.textContent = roleMap[type] || "⏺";
  const content = document.createElement("div");
  content.className = "content";
  const paragraph = document.createElement("p");
  paragraph.textContent = text;
  content.appendChild(paragraph);
  message.append(role, content);
  publishOutput.appendChild(message);
  publishOutput.scrollTop = publishOutput.scrollHeight;
}

function activateTab(tabId) {
  document.querySelectorAll(".tab-nav button").forEach((button) => {
    button.classList.toggle("active", button.dataset.tab === tabId);
  });
  document.querySelectorAll(".tab-panel").forEach((panel) => {
    panel.classList.toggle("active", panel.id === tabId);
  });
}

function resetAuthModal() {
  loginStep.classList.remove("hidden");
  permissionStep.classList.add("hidden");
  successStep.classList.add("hidden");
}

function openAuthModal() {
  resetAuthModal();
  authModal.classList.add("visible");
  authModal.setAttribute("aria-hidden", "false");
}

function closeAuthModal() {
  authModal.classList.remove("visible");
  authModal.setAttribute("aria-hidden", "true");
}

async function bindWalletFlow() {
  appendLine("我要绑定binance agent wallet", "user");
  appendLine("我会为当前 Claude Code session 安装 Binance Skill，并开通一个 Agent 专有 Wallet。", "assistant");
  await wait(800);
  appendLine("$ claude skill install binance-agent-payments", "tool");
  await wait(900);
  appendLine("Skill 已安装：Pay、Wallet、x402、审计工具已暴露给 Claude Code / Codex。", "success");
  await wait(700);
  appendLine("$ binance wallet bind --scope agent-pay --create-api-key --browser", "tool");
  await wait(900);
  appendLine("正在打开浏览器授权窗口：accounts.binance.com/oauth/authorize", "assistant");
  openAuthModal();
}

function completeWalletBinding() {
  walletBound = true;
  walletStatus.textContent = "Agent Wallet 已绑定";
  walletStatus.classList.add("connected");
  closeAuthModal();
  appendLine("Binance Agent Wallet 已绑定。", "success");
  appendLine("统一钱包资金来源：Binance 钱包余额 -> 链上钱包余额 -> 绑定银行卡，覆盖加密资产和法币资金来源。", "system");
  appendLine("Agent 专有 API Key 已创建：仅限当前开发工具和个人 Agent 使用。", "success");
  appendLine("Agent 专有额度：每日 100 USDT，单笔自动付款 10 USDT，仅允许已验证 API / MCP / 开发工具。", "system");
  appendLine("风控保障：高风险商户、异常频率、超限额、陌生链上地址都会触发人工确认或阻断。", "dim");
}

async function requestXDataFlow() {
  appendLine("我要拉取BTC和ETH最近30天分钟级行情数据", "user");
  if (!walletBound) {
    appendLine("⚠ 还没有绑定 Binance Agent Wallet。请先输入：我要绑定binance agent wallet", "warn");
    return;
  }
  if (flowRunning) {
    appendLine("当前已有一个 agent 任务在执行，请稍后再试。", "warn");
    return;
  }
  flowRunning = true;
  appendLine("正在分析任务：目标资产 BTC/ETH，数据类型：分钟级 OHLCV、成交量、盘口快照，时间范围：最近 30 天。", "assistant");
  await wait(1400);
  appendLine("大模型正在拆解需求：需要历史 K 线、实时价格校验、交易对元数据和数据完整性校验。", "dim");
  await wait(1600);
  appendLine("$ binance agent discover \"BTC ETH historical OHLCV market data last 30 days\"", "tool");
  await wait(1900);
  appendLine("对比候选数据源：Binance 官方 Market Data、DEX Pair Quotes、第三方行情聚合商、MCP 数据服务。", "dim");
  await wait(1600);
  appendLine("找到可用数据源：Binance Market Data MCP", "success");
  await wait(900);
  appendLine("价格：历史 OHLCV 查询 0.02 USDT / query，预计本次最高预算约 1 USDT。", "system");
  await wait(1100);
  appendLine("建议使用 Binance Agent Wallet 自动支付，命中策略：已验证数据源、金额低于单笔限额。", "assistant");
  await wait(800);
  startCountdownPayment();
}

function startCountdownPayment() {
  paymentRejected = false;
  paymentCompleted = false;
  countdownLeft = 30;
  const card = appendHTML(`
    <div class="countdown-card" id="countdownCard">
      <div>将在 <strong id="countdownValue">30</strong> 秒后自动使用 Binance Agent Wallet 支付。</div>
      <div>支付对象：Binance Market Data · 预计累计消费：1.00 USDT · 支付资产：USDT</div>
      <div class="countdown-actions">
        <button class="primary" id="approvePayment" type="button">同意，立即支付</button>
        <button class="danger" id="rejectPayment" type="button">拒绝本次支付</button>
      </div>
    </div>
  `);
  const countdownValue = card.querySelector("#countdownValue");
  const approvePayment = card.querySelector("#approvePayment");
  const rejectPayment = card.querySelector("#rejectPayment");
  approvePayment.addEventListener("click", () => {
    if (paymentCompleted || paymentRejected) return;
    clearInterval(countdownTimer);
    completeXDataPayment("用户已同意立即支付。");
  });
  rejectPayment.addEventListener("click", () => {
    if (paymentCompleted) return;
    paymentRejected = true;
    flowRunning = false;
    clearInterval(countdownTimer);
    appendLine("用户已拒绝本次自动支付。任务停止。", "warn");
  });

  clearInterval(countdownTimer);
  countdownTimer = setInterval(() => {
    countdownLeft -= 1;
    countdownValue.textContent = String(countdownLeft);
    if (countdownLeft <= 0) {
      clearInterval(countdownTimer);
      if (!paymentRejected) {
        completeXDataPayment("倒计时结束，未收到拒绝操作。");
      }
    }
  }, 1000);
}

async function completeXDataPayment(reason) {
  if (paymentCompleted) return;
  paymentCompleted = true;
  appendLine(reason, "assistant");
  await wait(900);
  appendLine("$ binance agent pay --merchant binance-market-data --amount 1.00 --asset USDT", "tool");
  await wait(900);
  appendLine("Policy Engine 批准付款：Binance Market Data 为官方商品，金额 1.00 USDT，低于单笔限额。", "success");
  await wait(900);
  appendLine("已通过 Binance Agent Wallet 支付 1.00 USDT。", "success");
  await wait(1200);
  appendLine("$ binance.marketData.ohlcv --symbols BTCUSDT,ETHUSDT --interval 1m --range 30d --paid-receipt bpay_7f93", "tool");
  await wait(1500);
  appendLine("正在分页请求 Binance Market Data：按交易对、时间窗口和 interval 拉取。", "dim");
  await wait(1400);
  appendLine("正在清洗结果：去重、排序、校验缺口、补齐资产元数据。", "dim");
  await wait(1300);
  appendLine("数据拉取完成：OHLCV、成交量、盘口快照、资产元数据和原始响应已保存。", "success");
  await wait(800);
  appendLine("本次任务累计消费：1.00 USDT。收据已同步到 Binance App 审计日志。", "success");
  flowRunning = false;
}

function handleCommand(command) {
  const normalized = command.trim().toLowerCase();
  if (!normalized) return;
  if (normalized.includes("绑定") && normalized.includes("binance")) {
    bindWalletFlow();
    return;
  }
  if ((normalized.includes("btc") || normalized.includes("eth") || normalized.includes("行情") || normalized.includes("market")) && (normalized.includes("数据") || normalized.includes("data") || normalized.includes("拉取"))) {
    requestXDataFlow();
    return;
  }
  appendLine(command, "user");
  appendLine("我还不认识这个演示命令。可以试试：我要绑定binance agent wallet", "dim");
}

async function marketplacePurchase(service) {
  activateTab("consumer");
  appendLine(`从 Marketplace 选择服务：${service}`, "user");
  await wait(700);
  appendLine(`正在读取 ${service} 的 agent-service.json、MCP tools 和报价接口。`, "assistant");
  await wait(900);
  appendLine(`$ binance agent quote --service "${service}"`, "tool");
  await wait(900);
  appendLine(`报价已返回：支持 Binance Agent Wallet / x402，小额自动付款可用。`, "success");
  appendLine("你可以继续输入具体任务，Agent 会按限额策略请求确认或自动付款。", "dim");
}

async function runPublishDemo() {
  if (publishRunning) return;
  publishRunning = true;
  publishInput.value = "";
  appendPublishLine("发布binance market data agent商品", "user");
  await wait(700);
  appendPublishLine("我会把 Binance Market Data 包装成 Agent 可发现、可报价、可自动付款调用的商品。", "assistant");
  await wait(800);
  appendPublishLine("$ binance agent-product init binance-market-data", "tool");
  await wait(900);
  appendPublishLine("已生成 .well-known/agent-service.json、OpenAPI schema、MCP tool manifest。", "success");
  await wait(900);
  appendPublishLine("$ binance agent-product capability add historical_ohlcv realtime_quote dex_pair_quote", "tool");
  await wait(900);
  appendPublishLine("已配置能力：历史 OHLCV、实时价格、DEX Pair Quote、资产元数据。", "success");
  await wait(900);
  appendPublishLine("$ binance agent-product pricing set --unit query --price 0.02USDT --trial 100calls", "tool");
  await wait(900);
  appendPublishLine("已配置报价接口、试用额度、退款策略和 Agent 自动付款上限。", "success");
  await wait(900);
  appendPublishLine("$ binance agent-product verify --kyb binance-official --risk-policy agent-autopay", "tool");
  await wait(1000);
  appendPublishLine("KYB / 风控审核通过：官方数据商品，低风险，允许 Agent 小额自动付款。", "success");
  await wait(900);
  appendPublishLine("$ binance agent-product publish --marketplace --mcp https://mcp.market-data.binance.com", "tool");
  await wait(900);
  appendPublishLine("发布完成：Agent 可搜索、比较、请求 quote、使用 Binance Agent Wallet 或 x402 付款并调用。", "success");
  publishStatus.textContent = "launch: 已上线";
  publishStatus.classList.add("connected");
  await wait(700);
  appendPublishLine("商品已出现在 Binance Agent Marketplace：Binance Market Data MCP。", "assistant");
  publishRunning = false;
}

async function runCheckoutDemo() {
  if (checkoutRunning) return;
  checkoutRunning = true;
  checkoutInput.value = "";
  appendCheckoutLine("集成binance统一收银台", "user");
  await wait(700);
  appendCheckoutLine("我会检查第三方商家网站项目，并以商户 Binance KYB 账户接入统一收银台：传统网页支付 + Agent 收款一次完成。", "assistant");
  await wait(900);
  appendCheckoutLine("$ pwd", "tool");
  await wait(600);
  appendCheckoutLine("/Users/company/twitterapi-web", "dim");
  await wait(700);
  appendCheckoutLine("$ rg \"checkout|payment|pricing\" src package.json", "tool");
  await wait(900);
  appendCheckoutLine("发现 Next.js 商品定价页、订阅服务和一次性数据包订单模型，可以接入 hosted checkout。", "success");
  await wait(800);
  appendCheckoutLine("$ binance merchant login --kyb --account twitterapi-kyb", "tool");
  await wait(1000);
  appendCheckoutLine("需要商户 Binance KYB 账户：Merchant ID、结算币种、Webhook secret、允许的域名。", "assistant");
  await wait(1300);
  appendCheckoutLine("已读取商户信息：merchant_id=bn_merchant_twitterapi_demo，settlement=USDT/FDUSD，domain=twitterapi.io。", "success");
  merchantStatus.textContent = "merchant: KYB 已连接";
  merchantStatus.classList.add("connected");
  await wait(700);
  appendCheckoutLine("$ npm i @binance/unified-checkout", "tool");
  await wait(1000);
  appendCheckoutLine("package installed: @binance/unified-checkout", "success");
  await wait(800);
  appendCheckoutLine("$ npx binance checkout init --merchant bn_merchant_twitterapi_demo --hosted --agent-pay --subscriptions", "tool");
  await wait(900);
  appendCheckoutLine("已生成 /api/binance/checkout/session、/api/binance/webhook、订阅 checkout 和按钮组件。", "success");
  await wait(800);
  appendCheckoutLine("已启用：Binance Pay、Agent Wallet、x402、统一钱包余额、链上 DEX 钱包、Card fallback。", "success");
  await wait(800);
  appendCheckoutLine("一行代码已插入商品页：<BinanceCheckout orderId={order.id} />", "tool");
  await wait(900);
  appendCheckoutLine("$ npm run dev", "tool");
  await wait(1100);
  appendCheckoutLine("本地商户网站已启动：http://localhost:3000/pricing", "success");
  appendCheckoutLine("商户价值：一次接入，用户可用 Binance 余额、链上资产、银行卡付款，商户统一结算到 Binance Merchant Account。", "success");
  appendCheckoutLine("集成完成。现在可以点击“测试传统网页线上支付”，打开商户商品页验证支付链路。", "assistant");
  openMerchantSite.disabled = false;
  testWebPayment.disabled = false;
  checkoutRunning = false;
}

function openMerchantSiteModal() {
  merchantSiteModal.classList.add("visible");
  merchantSiteModal.setAttribute("aria-hidden", "false");
}

function closeMerchantSiteModal() {
  merchantSiteModal.classList.remove("visible");
  merchantSiteModal.setAttribute("aria-hidden", "true");
}

function openBinanceCheckoutModal() {
  checkoutResult.textContent = "";
  checkoutAddress.textContent = "https://accounts.binance.com/login?continue=checkout";
  checkoutLoginStep.classList.remove("hidden");
  checkoutWalletStep.classList.add("hidden");
  checkoutSuccessStep.classList.add("hidden");
  document.querySelectorAll(".payment-choice").forEach((button, index) => {
    button.classList.toggle("selected", index === 0);
  });
  binanceCheckoutModal.classList.add("visible");
  binanceCheckoutModal.setAttribute("aria-hidden", "false");
}

function closeBinanceCheckoutModal() {
  binanceCheckoutModal.classList.remove("visible");
  binanceCheckoutModal.setAttribute("aria-hidden", "true");
}

function startWebCheckout(product, amount) {
  checkoutMerchant.textContent = "商户：twitterapi.io";
  checkoutAmount.textContent = `订单金额：${amount} USD`;
  walletCheckoutMerchant.textContent = "商户：twitterapi.io";
  walletCheckoutAmount.textContent = `订单金额：${amount} USD`;
  closeMerchantSiteModal();
  appendCheckoutLine(`用户在商户网站选择商品：${product}，金额 ${amount} USD`, "user");
  openBinanceCheckoutModal();
}

function completeCheckoutLogin() {
  checkoutAddress.textContent = "https://checkout.binance.com/wallet/pay_7f93";
  checkoutLoginStep.classList.add("hidden");
  checkoutWalletStep.classList.remove("hidden");
  checkoutSuccessStep.classList.add("hidden");
  appendCheckoutLine("用户已登录 Binance，进入统一钱包支付页面。", "success");
}

async function confirmCheckoutPayment() {
  const selected = document.querySelector(".payment-choice.selected");
  const method = selected ? selected.dataset.payMethod : "Binance 钱包余额";
  checkoutResult.textContent = `正在使用${method}支付...`;
  appendCheckoutLine(`用户在 Binance Checkout 中选择：${method}`, "user");
  await wait(900);
  checkoutAddress.textContent = "https://checkout.binance.com/success/pay_7f93";
  checkoutWalletStep.classList.add("hidden");
  checkoutSuccessStep.classList.remove("hidden");
  checkoutSuccessText.textContent = `已使用${method}完成支付。订单已完成，商户将收到 Binance Checkout webhook。`;
  appendCheckoutLine("Binance Checkout 返回 payment_intent.succeeded webhook。", "success");
  await wait(700);
  appendCheckoutLine("商户后台订单已更新：paid，结算资产 USDT，收据同步到商户账户。", "success");
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

terminalForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const value = terminalInput.value;
  terminalInput.value = "";
  handleCommand(value);
});

document.querySelectorAll("[data-command]").forEach((button) => {
  button.addEventListener("click", () => handleCommand(button.dataset.command));
});

document.querySelectorAll("[data-tab]").forEach((button) => {
  button.addEventListener("click", () => activateTab(button.dataset.tab));
});

document.querySelectorAll("[data-tab-jump]").forEach((button) => {
  button.addEventListener("click", () => activateTab(button.dataset.tabJump));
});

document.querySelectorAll(".marketplace-buy").forEach((button) => {
  button.addEventListener("click", () => marketplacePurchase(button.dataset.service));
});

publishDemo.addEventListener("click", runPublishDemo);
publishQuick.addEventListener("click", runPublishDemo);
publishForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const command = publishInput.value.trim().toLowerCase();
  if (!command) return;
  if (command.includes("发布") || command.includes("上线") || command.includes("publish")) {
    runPublishDemo();
    return;
  }
  appendPublishLine(publishInput.value, "user");
  publishInput.value = "";
  appendPublishLine("可以输入：发布binance market data agent商品", "dim");
});
checkoutDemo.addEventListener("click", runCheckoutDemo);
checkoutQuick.addEventListener("click", runCheckoutDemo);
checkoutForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const command = checkoutInput.value.trim().toLowerCase();
  if (!command) return;
  if (command.includes("binance") && (command.includes("checkout") || command.includes("收银台"))) {
    runCheckoutDemo();
    return;
  }
  if (command.includes("测试") && command.includes("支付")) {
    openMerchantSiteModal();
    return;
  }
  appendCheckoutLine(checkoutInput.value, "user");
  checkoutInput.value = "";
  appendCheckoutLine("可以输入：集成binance统一收银台", "dim");
});
openMerchantSite.addEventListener("click", openMerchantSiteModal);
testWebPayment.addEventListener("click", openMerchantSiteModal);
closeMerchantSite.addEventListener("click", closeMerchantSiteModal);
document.querySelectorAll(".buy-product").forEach((button) => {
  button.addEventListener("click", () => {
    startWebCheckout(button.dataset.product, button.dataset.amount);
  });
});
closeBinanceCheckout.addEventListener("click", closeBinanceCheckoutModal);
checkoutLoginBtn.addEventListener("click", completeCheckoutLogin);
confirmCheckoutPay.addEventListener("click", confirmCheckoutPayment);
closeCheckoutSuccess.addEventListener("click", closeBinanceCheckoutModal);
document.querySelectorAll(".payment-choice").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".payment-choice").forEach((choice) => choice.classList.remove("selected"));
    button.classList.add("selected");
  });
});
merchantSiteModal.addEventListener("click", (event) => {
  if (event.target === merchantSiteModal) closeMerchantSiteModal();
});
binanceCheckoutModal.addEventListener("click", (event) => {
  if (event.target === binanceCheckoutModal) closeBinanceCheckoutModal();
});

closeAuth.addEventListener("click", closeAuthModal);
loginBtn.addEventListener("click", () => {
  loginStep.classList.add("hidden");
  permissionStep.classList.remove("hidden");
});
confirmAuth.addEventListener("click", () => {
  permissionStep.classList.add("hidden");
  successStep.classList.remove("hidden");
});
returnTerminal.addEventListener("click", completeWalletBinding);
authModal.addEventListener("click", (event) => {
  if (event.target === authModal) {
    closeAuthModal();
  }
});

appendLine("Claude Code 已连接到本地项目：~/demo/binance-agent-wallet", "success");
appendLine("可以输入：我要绑定binance agent wallet", "dim");
appendPublishLine("Claude Code 已进入 Agent 商品目录：~/company/binance-market-data-agent-product", "success");
appendPublishLine("可以输入：发布binance market data agent商品", "dim");
appendCheckoutLine("Claude Code 已进入第三方商家网站项目：~/company/twitterapi-web", "success");
appendCheckoutLine("可以输入：集成binance统一收银台", "dim");
