#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";

import { FetchBalanceSchema, fetchBalance } from "./tools/FetchBalance";
import { ReadContractSchema, readContract } from "./tools/ReadContract";
import {
  FetchTokenBalanceSchema,
  fetchTokenBalance,
} from "./tools/FetchTokenBalance";
import { FetchQuoteSchema, fetchQuote } from "./tools/FetchQuote";
import { TransferTokenSchema, transferToken } from "./tools/TransferToken";
import { TransferSchema, transfer } from "./tools/Transfer";
import { version } from "../package.json";

const server = new Server(
  {
    name: "web3-mcp-server",
    version,
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
  const tools = [
    {
      name: "fetch_balance",
      description: "Get the balance of a wallet",
      inputSchema: z.toJSONSchema(FetchBalanceSchema),
    },
    {
      name: "read_contract",
      description: "Read a value from a contract",
      inputSchema: z.toJSONSchema(ReadContractSchema),
    },
    {
      name: "fetch_token_balance",
      description: "Get the balance of a token",
      inputSchema: z.toJSONSchema(FetchTokenBalanceSchema),
    },
    {
      name: "fetch_quote",
      description: "Get the price of a token",
      inputSchema: z.toJSONSchema(FetchQuoteSchema),
    },
  ];

  if (process.env.PRIVATE_KEY) {
    tools.push(
      {
        name: "transfer",
        description: "Transfer a native token to a wallet",
        inputSchema: z.toJSONSchema(TransferSchema),
      },
      {
        name: "transfer_token",
        description: "Transfer a ERC20 token to a wallet",
        inputSchema: z.toJSONSchema(TransferTokenSchema),
      }
    );
  }

  return {
    tools,
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  try {
    if (!request.params.arguments) {
      throw new Error("Arguments are required");
    }

    switch (request.params.name) {
      case "fetch_balance": {
        const args = FetchBalanceSchema.parse(request.params.arguments);
        const result = await fetchBalance(args);

        return {
          content: [
            {
              type: "text",
              text: result.balance,
              description: "The balance of the wallet",
            },
            {
              type: "text",
              text: result.formattedBalance,
              description: "The formatted balance of the wallet",
            },
          ],
        };
      }

      case "read_contract": {
        const args = ReadContractSchema.parse(request.params.arguments);
        const result = await readContract(args);

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, (_, value) =>
                typeof value === "bigint" ? value.toString() : value
              ),
              description:
                "The result JSON formatted of the contract function call",
            },
          ],
        };
      }

      case "fetch_token_balance": {
        const args = FetchTokenBalanceSchema.parse(request.params.arguments);
        const result = await fetchTokenBalance(args);

        return {
          content: [
            {
              type: "text",
              text: result.balance,
              description: "The balance of the token",
            },
            {
              type: "text",
              text: result.formattedBalance,
              description: "The formatted balance of the token",
            },
          ],
        };
      }

      case "fetch_quote": {
        const args = FetchQuoteSchema.parse(request.params.arguments);
        const result = await fetchQuote(args);

        return {
          content: [
            {
              type: "text",
              text: result.toString(),
              description: "The price of the token in USD",
            },
          ],
        };
      }

      case "transfer": {
        const args = TransferSchema.parse(request.params.arguments);
        const result = await transfer(args);

        return {
          content: [
            {
              type: "text",
              text: result.toString(),
              description: "The transaction hash of the transfer",
            },
          ],
        };
      }

      case "transfer_token": {
        const args = TransferTokenSchema.parse(request.params.arguments);
        const result = await transferToken(args);

        return {
          content: [
            {
              type: "text",
              text: result.toString(),
              description: "The transaction hash of the token transfer",
            },
          ],
        };
      }

      default: {
        throw new Error(`Unknown tool: ${request.params.name}`);
      }
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(`Invalid input: ${JSON.stringify(error.issues)}`);
    }

    throw error;
  }
});

const main = async () => {
  const transport = new StdioServerTransport();
  await server.connect(transport);
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
