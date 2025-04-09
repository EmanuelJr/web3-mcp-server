import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import zodToJsonSchema from "zod-to-json-schema";

import { version } from "../package.json";
import { FetchBalanceSchema, fetchBalance } from "./tools/FetchBalance";
import { ReadContractSchema, readContract } from "./tools/ReadContract";
import {
  FetchTokenBalanceSchema,
  fetchTokenBalance,
} from "./tools/FetchTokenBalance";
import { FetchQuoteSchema, fetchQuote } from "./tools/FetchQuote";

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
  return {
    tools: [
      {
        name: "fetch_balance",
        description: "Get the balance of a wallet",
        inputSchema: zodToJsonSchema(FetchBalanceSchema),
      },
      {
        name: "read_contract",
        description: "Read a value from a contract",
        inputSchema: zodToJsonSchema(ReadContractSchema),
      },
      {
        name: "fetch_token_balance",
        description: "Get the balance of a token",
        inputSchema: zodToJsonSchema(FetchTokenBalanceSchema),
      },
      {
        name: "fetch_quote",
        description: "Get the price of a token",
        inputSchema: zodToJsonSchema(FetchQuoteSchema),
      },
    ],
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

      default:
        throw new Error(`Unknown tool: ${request.params.name}`);
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(`Invalid input: ${JSON.stringify(error.errors)}`);
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
