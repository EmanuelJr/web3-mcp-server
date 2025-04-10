# Web3 MCP Server

A Model Context Protocol (MCP) server implementation for Web3 interactions on EVM chains. This server enables seamless interaction with blockchain networks through the Model Context Protocol.

## 🚀 Features

- 📊 Fetch token balances across multiple chains
- 📝 Call smart contract functions
- 🔗 Support for multiple EVM-compatible chains

## 🔧 Configuration

### Claude Desktop Integration

#### Using NPX

Add the following configuration to your Claude Desktop settings:

```json
{
  "mcpServers": {
    "web3": {
      "command": "npx",
      "args": ["-y", "web3-mcp-server"]
    }
  }
}
```

#### Using Docker

For Docker-based deployment, use this configuration:

```json
{
  "mcpServers": {
    "web3": {
      "command": "docker",
      "args": ["run", "-i", "--rm", "emanueljr/web3-mcp-server"]
    }
  }
}
```

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
