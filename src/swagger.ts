import express, { Express } from "express";
import path from "path";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { ENV } from "./config/env";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "PayInvoFlow API",
      version: "1.0.0",
      description: "API documentation for PayInvoFlow",
    },
    servers: [
      {
        url: `/api`,
        description: "PayInvoFlow API",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description:
            "Enter JWT token (from /auth/login) as: **Bearer <token>**",
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: [
    "./src/routes/**/*.ts",
    "./dist/routes/**/*.js",
    "./src/routes/**/*.js",
  ],
};

const swaggerSpec = swaggerJsdoc(options);

const swaggerOptions = {
  validatorUrl: null,
  deepLinking: true,
  displayOperationId: false,
  defaultModelsExpandDepth: 1,
  defaultModelExpandDepth: 1,
  defaultModelRendering: "example",
  displayRequestDuration: true,
  docExpansion: "list",
  filter: true,
  maxDisplayedTags: 8,
  showExtensions: true,
  showCommonExtensions: true,
  operationsSorter: "alpha",
  tagsSorter: "alpha",
  useUnsafeMarkdown: false,
  tryItOutEnabled: true,
  supportedSubmitMethods: [
    "get",
    "put",
    "post",
    "delete",
    "options",
    "head",
    "patch",
    "trace",
  ],
  requestSnippetsEnabled: false,
  oauth2RedirectUrl: undefined,
  withCredentials: false,
  persistAuthorization: true,
};

export function swaggerDocs(app: Express, port: number) {
  app.use(
    "/swagger-ui",
    express.static(path.join(__dirname, "../node_modules/swagger-ui-dist"))
  );

  app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      swaggerOptions: swaggerOptions,
      customCssUrl: "/swagger-ui/swagger-ui.css",
      customJs: [
        "/swagger-ui/swagger-ui-bundle.js",
        "/swagger-ui/swagger-ui-standalone-preset.js",
      ],
    })
  );

  console.log(`📖 Swagger docs available at ${ENV.DOMAIN}/api-docs`);
}
