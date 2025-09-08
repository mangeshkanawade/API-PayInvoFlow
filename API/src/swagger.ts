import { Express } from "express";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

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
        url: "http://localhost:5000/api",
        description: "Local development server",
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
  apis: ["./src/routes/**/*.ts"],
};

const swaggerSpec = swaggerJsdoc(options);

const swaggerOptions = {
  validatorUrl: null, // Disable online spec validator
  deepLinking: true, // Enable deep linking for tags/operations
  displayOperationId: false, // Show operationId in the UI
  defaultModelsExpandDepth: 1, // Expansion depth for models (-1 hides them)
  defaultModelExpandDepth: 1, // Expansion depth for the model on model-example section
  defaultModelRendering: "example", // "model" or "example" by default
  displayRequestDuration: true, // Show request duration for "Try it out"
  docExpansion: "list", // "none", "list" or "full" (UI default expansion)
  filter: true, // Enable operation filtering (true/string)
  maxDisplayedTags: 8, // Limit the number of tags displayed
  showExtensions: true, // Show vendor extensions (x- fields)
  showCommonExtensions: true, // Show pattern/maxLength/minLength etc.
  operationsSorter: "alpha", // Sort operations: "alpha" | "method" | function
  tagsSorter: "alpha", // Sort tags: "alpha" | function
  useUnsafeMarkdown: false, // Leave style/class/data-* attributes (deprecated)
  tryItOutEnabled: true, // Enable “Try it out” by default
  supportedSubmitMethods: [
    // Methods allowed for “Try it out”
    "get",
    "put",
    "post",
    "delete",
    "options",
    "head",
    "patch",
    "trace",
  ],
  requestSnippetsEnabled: false, // Show request code snippets
  oauth2RedirectUrl: undefined, // Custom OAuth2 redirect URL
  withCredentials: false, // Send credentials with CORS requests
  persistAuthorization: true, // Persist auth on browser reload
  // syntaxHighlight can be customized if needed:
  // syntaxHighlight: { activated: true, theme: "monokai" },
  // explorer: true,
};

export function swaggerDocs(app: Express, port: number) {
  app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      swaggerOptions: swaggerOptions,
    })
  );

  console.log(`📖 Swagger docs available at http://localhost:${port}/api-docs`);
}
