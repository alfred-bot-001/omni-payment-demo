# Omni Payment Demo

这是一个静态 HTML demo，用于展示 Binance Agent Payment Stack 的端到端产品叙事：

1. 个人用户绑定 Binance Wallet 和购买 Agent 服务。
2. 第三方商家集成 Binance 统一收银台。
3. Binance Agent Marketplace。
4. Agent 商品发布上线。

核心概念：

- C 端：Agent 专有 Wallet，一个钱包管理 Binance 余额、银行卡、链上钱包等法币 / 加密资产，并提供 Agent 专有额度、API Key 和风控。
- 商家端：一站式全资产覆盖的支付服务提供商，一次接入，触达 Binance 用户，覆盖法币 / 加密资产，支持传统网页支付和 Agent 收款。

## 启动

```bash
python3 -m http.server 8765
```

浏览器打开：

```text
http://localhost:8765/
```

## 演示路径

### 个人用户绑定 Binance Wallet 和购买 Agent 服务

- 点击 `绑定 Binance Agent Wallet`。
- 在浏览器风格授权窗口中登录 Binance，选择 Binance 钱包余额、链上钱包和银行卡，设置 Agent 专有额度。
- 返回终端后购买 Binance Market Data Agent 服务，观察倒计时确认、自动支付和审计日志。

### 第三方商家集成 Binance 统一收银台

- 点击 `集成 Binance 收银台`，模拟小商家 / 个人开发者在 Claude Code 中一行命令接入。
- 点击 `测试网页支付`，在商户商品页购买或订阅数据服务。
- 进入 Binance Checkout，登录 Binance，选择统一钱包资金来源并完成支付。

### Binance Agent Marketplace

- 浏览 Binance 官方 Market Data、DEX Pair Quotes、Historical OHLCV 等 Agent 可购买服务。
- 点击服务后，Agent 自动读取 manifest、MCP tools 和报价接口。

### Agent 商品发布上线

- 模拟商家创建 agent-service manifest、配置报价、完成 KYB / 风控审核，并发布到 Agent Marketplace。
