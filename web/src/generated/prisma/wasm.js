
Object.defineProperty(exports, "__esModule", { value: true });

const {
  PrismaClientKnownRequestError,
  PrismaClientUnknownRequestError,
  PrismaClientRustPanicError,
  PrismaClientInitializationError,
  PrismaClientValidationError,
  getPrismaClient,
  sqltag,
  empty,
  join,
  raw,
  skip,
  Decimal,
  Debug,
  objectEnumValues,
  makeStrictEnum,
  Extensions,
  warnOnce,
  defineDmmfProperty,
  Public,
  getRuntime,
  createParam,
} = require('./runtime/wasm.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 6.6.0
 * Query Engine version: f676762280b54cd07c770017ed3711ddde35f37a
 */
Prisma.prismaVersion = {
  client: "6.6.0",
  engine: "f676762280b54cd07c770017ed3711ddde35f37a"
}

Prisma.PrismaClientKnownRequestError = PrismaClientKnownRequestError;
Prisma.PrismaClientUnknownRequestError = PrismaClientUnknownRequestError
Prisma.PrismaClientRustPanicError = PrismaClientRustPanicError
Prisma.PrismaClientInitializationError = PrismaClientInitializationError
Prisma.PrismaClientValidationError = PrismaClientValidationError
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = sqltag
Prisma.empty = empty
Prisma.join = join
Prisma.raw = raw
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = Extensions.getExtensionContext
Prisma.defineExtension = Extensions.defineExtension

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}





/**
 * Enums
 */
exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
});

exports.Prisma.UserScalarFieldEnum = {
  id: 'id',
  clerkId: 'clerkId',
  email: 'email',
  name: 'name',
  imageUrl: 'imageUrl',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.DonationScalarFieldEnum = {
  id: 'id',
  amount: 'amount',
  currency: 'currency',
  status: 'status',
  userId: 'userId',
  campaignId: 'campaignId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.CampaignScalarFieldEnum = {
  id: 'id',
  title: 'title',
  description: 'description',
  target: 'target',
  raised: 'raised',
  imageUrl: 'imageUrl',
  active: 'active',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.EventScalarFieldEnum = {
  id: 'id',
  title: 'title',
  description: 'description',
  location: 'location',
  startDate: 'startDate',
  endDate: 'endDate',
  imageUrl: 'imageUrl',
  organizerId: 'organizerId',
  capacity: 'capacity',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.EventAttendeeScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  eventId: 'eventId',
  status: 'status',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.QueryMode = {
  default: 'default',
  insensitive: 'insensitive'
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};


exports.Prisma.ModelName = {
  User: 'User',
  Donation: 'Donation',
  Campaign: 'Campaign',
  Event: 'Event',
  EventAttendee: 'EventAttendee'
};
/**
 * Create the Client
 */
const config = {
  "generator": {
    "name": "client",
    "provider": {
      "fromEnvVar": null,
      "value": "prisma-client-js"
    },
    "output": {
      "value": "C:\\Users\\User\\Documents\\GitHub\\wamumbi\\web\\src\\generated\\prisma",
      "fromEnvVar": null
    },
    "config": {
      "engineType": "library"
    },
    "binaryTargets": [
      {
        "fromEnvVar": null,
        "value": "windows",
        "native": true
      }
    ],
    "previewFeatures": [
      "driverAdapters"
    ],
    "sourceFilePath": "C:\\Users\\User\\Documents\\GitHub\\wamumbi\\web\\prisma\\schema.prisma",
    "isCustomOutput": true
  },
  "relativeEnvPaths": {
    "rootEnvPath": "../../../.env",
    "schemaEnvPath": "../../../.env"
  },
  "relativePath": "../../../prisma",
  "clientVersion": "6.6.0",
  "engineVersion": "f676762280b54cd07c770017ed3711ddde35f37a",
  "datasourceNames": [
    "db"
  ],
  "activeProvider": "postgresql",
  "postinstall": false,
  "inlineDatasources": {
    "db": {
      "url": {
        "fromEnvVar": "DATABASE_URL",
        "value": null
      }
    }
  },
  "inlineSchema": "// This is your Prisma schema file,\n// learn more about it in the docs: https://pris.ly/d/prisma-schema\n\n// Looking for ways to speed up your queries, or scale easily with your serverless or edge functions?\n// Try Prisma Accelerate: https://pris.ly/cli/accelerate-init\n\ngenerator client {\n  provider        = \"prisma-client-js\"\n  output          = \"../src/generated/prisma\"\n  previewFeatures = [\"driverAdapters\"]\n}\n\ndatasource db {\n  provider = \"postgresql\"\n  url      = env(\"DATABASE_URL\")\n}\n\n// User model\nmodel User {\n  id        String          @id @default(uuid())\n  clerkId   String          @unique\n  email     String          @unique\n  name      String?\n  imageUrl  String?\n  createdAt DateTime        @default(now())\n  updatedAt DateTime        @updatedAt\n  donations Donation[]\n  events    Event[]         @relation(\"EventOrganizer\")\n  attendees EventAttendee[]\n}\n\n// Donation model\nmodel Donation {\n  id         String    @id @default(uuid())\n  amount     Float\n  currency   String    @default(\"USD\")\n  status     String    @default(\"pending\") // pending, completed, failed\n  user       User      @relation(fields: [userId], references: [id], onDelete: Cascade)\n  userId     String\n  campaignId String?\n  campaign   Campaign? @relation(fields: [campaignId], references: [id], onDelete: SetNull)\n  createdAt  DateTime  @default(now())\n  updatedAt  DateTime  @updatedAt\n}\n\n// Campaign model for fundraising campaigns\nmodel Campaign {\n  id          String     @id @default(uuid())\n  title       String\n  description String\n  target      Float\n  raised      Float      @default(0)\n  imageUrl    String?\n  active      Boolean    @default(true)\n  createdAt   DateTime   @default(now())\n  updatedAt   DateTime   @updatedAt\n  donations   Donation[]\n}\n\n// Events model\nmodel Event {\n  id          String          @id @default(uuid())\n  title       String\n  description String\n  location    String\n  startDate   DateTime\n  endDate     DateTime\n  imageUrl    String?\n  organizer   User            @relation(\"EventOrganizer\", fields: [organizerId], references: [id])\n  organizerId String\n  capacity    Int?\n  createdAt   DateTime        @default(now())\n  updatedAt   DateTime        @updatedAt\n  attendees   EventAttendee[]\n}\n\n// Event Attendees - join table for users attending events\nmodel EventAttendee {\n  id        String   @id @default(uuid())\n  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n  userId    String\n  event     Event    @relation(fields: [eventId], references: [id], onDelete: Cascade)\n  eventId   String\n  status    String   @default(\"registered\") // registered, attended, cancelled\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@unique([userId, eventId])\n}\n",
  "inlineSchemaHash": "e03fcbb11f35cc3ab4249b52fb064ce26154309e4e487d605673ae803060a872",
  "copyEngine": true
}
config.dirname = '/'

config.runtimeDataModel = JSON.parse("{\"models\":{\"User\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"clerkId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"email\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"name\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"imageUrl\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"donations\",\"kind\":\"object\",\"type\":\"Donation\",\"relationName\":\"DonationToUser\"},{\"name\":\"events\",\"kind\":\"object\",\"type\":\"Event\",\"relationName\":\"EventOrganizer\"},{\"name\":\"attendees\",\"kind\":\"object\",\"type\":\"EventAttendee\",\"relationName\":\"EventAttendeeToUser\"}],\"dbName\":null},\"Donation\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"amount\",\"kind\":\"scalar\",\"type\":\"Float\"},{\"name\":\"currency\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"status\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"user\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"DonationToUser\"},{\"name\":\"userId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"campaignId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"campaign\",\"kind\":\"object\",\"type\":\"Campaign\",\"relationName\":\"CampaignToDonation\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"}],\"dbName\":null},\"Campaign\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"title\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"description\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"target\",\"kind\":\"scalar\",\"type\":\"Float\"},{\"name\":\"raised\",\"kind\":\"scalar\",\"type\":\"Float\"},{\"name\":\"imageUrl\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"active\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"donations\",\"kind\":\"object\",\"type\":\"Donation\",\"relationName\":\"CampaignToDonation\"}],\"dbName\":null},\"Event\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"title\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"description\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"location\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"startDate\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"endDate\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"imageUrl\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"organizer\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"EventOrganizer\"},{\"name\":\"organizerId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"capacity\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"attendees\",\"kind\":\"object\",\"type\":\"EventAttendee\",\"relationName\":\"EventToEventAttendee\"}],\"dbName\":null},\"EventAttendee\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"user\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"EventAttendeeToUser\"},{\"name\":\"userId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"event\",\"kind\":\"object\",\"type\":\"Event\",\"relationName\":\"EventToEventAttendee\"},{\"name\":\"eventId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"status\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"}],\"dbName\":null}},\"enums\":{},\"types\":{}}")
defineDmmfProperty(exports.Prisma, config.runtimeDataModel)
config.engineWasm = {
  getRuntime: async () => require('./query_engine_bg.js'),
  getQueryEngineWasmModule: async () => {
    const loader = (await import('#wasm-engine-loader')).default
    const engine = (await loader).default
    return engine
  }
}
config.compilerWasm = undefined

config.injectableEdgeEnv = () => ({
  parsed: {
    DATABASE_URL: typeof globalThis !== 'undefined' && globalThis['DATABASE_URL'] || typeof process !== 'undefined' && process.env && process.env.DATABASE_URL || undefined
  }
})

if (typeof globalThis !== 'undefined' && globalThis['DEBUG'] || typeof process !== 'undefined' && process.env && process.env.DEBUG || undefined) {
  Debug.enable(typeof globalThis !== 'undefined' && globalThis['DEBUG'] || typeof process !== 'undefined' && process.env && process.env.DEBUG || undefined)
}

const PrismaClient = getPrismaClient(config)
exports.PrismaClient = PrismaClient
Object.assign(exports, Prisma)

