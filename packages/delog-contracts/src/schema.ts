// Compatibility SDL extracted from the original Delog API.
export const legacySchema = `
type Query { health: Boolean! }
type Mutation { _empty: Boolean }
type Response { status: Boolean!, error: Error }
type Error { code: String, message: String }
input InputValueString { value: String! }

    extend type Query {
        getAnalyticsLastPeriod(input: InputGetAnalyticsLastPeriod!): ResponseAnalyticsLastPeriod!
        getAnalyticsSize(input: InputGetAnalyticsSize!): ResponseAnalyticsSize!
    }


    type ResponseAnalyticsLastPeriod {
        status: Boolean!
        error: Error
        data: AnalyticsLastPeriod
    }

    type ResponseAnalyticsSize {
        status: Boolean!
        error: Error
        data: AnalyticsSize
    }

    type AnalyticsLastPeriod {
        fatal: Int
        error: Int
        warn: Int
        info: Int
        debug: Int
        trace: Int
    }

    extend type Owner {
        analytics: OwnerAnalytics!
    }

    type OwnerAnalytics {
        entries(input: InputGetAnalyticsLastPeriodData): AnalyticsRecordsCount!
        faults(input: InputGetAnalyticsLastPeriodData): AnalyticsRecordsCount!
        size(input: InputGetAnalyticsSize): AnalyticsSize!
    }

    type AnalyticsRecordsCount {
        project: String!
        period: String!
        data: [AnalyticsRecordData!]!
    }

    type AnalyticsSize {
        project: String!
        value: Int!
    }

    type AnalyticsRecordData {
        name: String!
        value: Int!
    }


    input InputGetAnalyticsLastPeriod {
        project: String!
        period: String!
        type: String!
    }

    input InputGetAnalyticsLastPeriodData {
        project: String!
        period: String!
    }

    input InputGetAnalyticsSize {
        project: String!
    }


    extend type Query {
        getCode(input: InputGetCode!): ResponseCode!
    }


    type ResponseCode {
        status: Boolean!
        error: Error
        data: Code
    }

    type Code {
        lines: [String!]
    }


    input InputGetCode {
        repository: InputGetCodeRepository!
        context: InputGetCodeContext!
    }

    input InputGetCodeRepository {
        provider: String!
        name: String!
        branch: String!
        commit: String!
    }

    input InputGetCodeContext {
        file: String!
        line: Int!
        column: Int!
    }


    extend type Query {
        getFormats: ResponseFormats!
    }


    extend type Mutation {
        generateFormat(input: InputGenerateFormat!): ResponseFormat!
        obliterateFormat(input: InputValueString!): Response!
    }


    type ResponseFormat {
        status: Boolean!
        error: Error
        data: Format
    }

    type ResponseFormats {
        status: Boolean!
        error: Error
        data: [Format!]
    }

    type Format {
        id: String!
        identifier: String!
        transform: String!
    }

    extend type Owner {
        formats: [Format!]!
    }


    input InputGenerateFormat {
        identifier: String!
        transform: String!
    }


    extend type Query {
        getNotifiers: ResponseNotifiers!
    }


    extend type Mutation {
        generateNotifier(input: InputGenerateNotifier!): ResponseNotifier!
        obliterateNotifier(input: InputValueString!): Response!
    }


    type ResponseNotifier {
        status: Boolean!
        error: Error
        data: Notifier
    }

    type ResponseNotifiers {
        status: Boolean!
        error: Error
        data: [Notifier!]
    }

    type Notifier {
        id: String!
        name: String!
        notifyOn: [String!]!
        type: String!
        data: String!
    }

    extend type Owner {
        notifiers: [Notifier!]!
    }


    input InputGenerateNotifier {
        name: String!
        notifyOn: [String!]!
        type: String!
        data: String!
    }


    extend type Query {
        getCurrentOwner: ResponseOwner!
        getUsageType: ResponseUsageType!
    }


    extend type Mutation {
        login(input: InputLogin!): ResponseOwner!
        logout: Response!
    }


    type ResponseOwner {
        status: Boolean!
        error: Error
        data: Owner
    }

    type Owner {
        id: ID!
    }

    type ResponseUsageType {
        status: Boolean!
        error: Error
        data: String!
    }


    input InputLogin {
        identonym: String!
        key: String!
    }


    extend type Query {
        getProjects: ResponseProjects!
    }


    extend type Mutation {
        generateProject(input: InputValueString!): ResponseProject!
        obliterateProject(input: InputValueString!): Response!
    }


    type ResponseProject {
        status: Boolean!
        error: Error
        data: Project
    }

    type ResponseProjects {
        status: Boolean!
        error: Error
        data: [Project!]
    }

    type Project {
        id: String!
        name: String!
    }

    extend type Owner {
        projects: [Project!]!
    }


    extend type Mutation {
        addProvider(input: InputAddProvider!): ResponseProvider!
        obliterateProvider(input: InputValueString!): Response!
    }


    type ResponseProvider {
        status: Boolean!
        error: Error
        data: Provider
    }

    type Provider {
        id: ID!
        name: String!
        type: String!
    }

    extend type Owner {
        providers: [Provider!]!
    }


    input InputAddProvider {
        type: String!
        token: String!
        name: String!
    }


    extend type Query {
        getRecords(input: InputQuery): ResponseRecords!
    }


    extend type Mutation {
        delogMutationRecord(input: DelogInputRecord!): Response!
        obliterateRecord(input: InputValueString!): Response!
        obliterateRecords(input: InputObliterateRecords): Response!
    }


    type ResponseRecords {
        status: Boolean!
        error: Error
        data: [Record!]
    }

    type Record {
        id: String!

        text: String!
        time: Float!
        log: String!
        level: Int!

        project: String!
        space: String!

        format: String!

        method: String
        error: String
        extradata: String
        context: DelogContext
    }

    type DelogContext {
        mode: String
        suite: String
        scenario: String
        sharedID: String
        sharedOrder: Int
        call: DelogContextCall
    }

    type DelogContextCall {
        repository: DelogContextRepository!
        caller: DelogContextCaller!
    }

    type DelogContextRepository {
        provider: String!
        name: String!
        branch: String!
        commit: String!
        basePath: String!
    }

    type DelogContextCaller {
        file: String!
        line: Int!
        column: Int!
    }


    input InputQuery {
        count: Int
        start: String
    }

    input DelogInputRecord {
        text: String!
        time: Float!
        level: Int!

        unit: String

        project: String
        space: String

        format: String

        method: String
        error: String
        extradata: String
        context: DelogInputContext
    }

    input DelogInputContext {
        mode: String
        suite: String
        scenario: String
        sharedID: String
        sharedOrder: Int
        call: DelogInputContextCall
    }

    input DelogInputContextCall {
        repository: DelogInputContextRepository!
        caller: DelogInputContextCaller!
    }

    input DelogInputContextRepository {
        provider: String!
        name: String!
        branch: String!
        commit: String!
        basePath: String!
    }

    input DelogInputContextCaller {
        file: String!
        line: Int!
        column: Int!
    }

    input InputObliterateRecords {
        filter: String
        ids: [String!]
    }


    extend type Query {
        getRepositories: ResponseRepositories!
        getProviderRepositories(input: InputValueString!): ResponseRepositories!
    }


    extend type Mutation {
        linkRepository(input: InputLinkRepository!): ResponseRepository!
        delinkRepository(input: InputValueString!): Response!
    }


    type ResponseRepository {
        status: Boolean!
        error: Error
        data: Repository
    }

    type ResponseRepositories {
        status: Boolean!
        error: Error
        data: [Repository!]
    }

    type Repository {
        id: ID!
        name: String!
        isPrivate: Boolean!
    }

    extend type Owner {
        repositories: [Repository!]!
    }


    input InputLinkRepository {
        providerID: String!
        nameWithOwner: String!
    }


    extend type Query {
        getSetup: ResponseSetup!
        verifyUniqueID(input: InputVerifyUniqueID!): Response!
    }


    type ResponseSetup {
        status: Boolean!
        error: Error
        data: Setup
    }

    type Setup {
        projects: [Project!]
    }


    input InputVerifyUniqueID {
        type: String!
        value: String!
    }


    extend type Query {
        getSpaces: ResponseSpaces!
    }


    extend type Mutation {
        generateSpace(input: InputGenerateSpace!): ResponseSpace!
        obliterateSpace(input: InputValueString!): Response!
    }


    type ResponseSpace {
        status: Boolean!
        error: Error
        data: Space
    }

    type ResponseSpaces {
        status: Boolean!
        error: Error
        data: [Space!]
    }

    type Space {
        id: String!
        name: String!
        project: String!
    }

    extend type Owner {
        spaces: [Space!]!
    }


    input InputGenerateSpace {
        name: String!
        project: String!
    }


    extend type Query {
        getTesters: ResponseTesters!
    }


    extend type Mutation {
        generateTester(input: InputGenerateTester!): ResponseTester!
        obliterateTester(input: InputValueString!): Response!
    }


    type ResponseTester {
        status: Boolean!
        error: Error
        data: Tester
    }

    type ResponseTesters {
        status: Boolean!
        error: Error
        data: [Tester!]
    }

    type Tester {
        id: String!
        name: String!
        project: String!
        suite: String!
        scenario: String!
        configuration: String!
    }

    extend type Owner {
        testers: [Tester!]!
    }


    input InputGenerateTester {
        id: String
        name: String!
        project: String!
        suite: String!
        scenario: String!
        configuration: String!
    }


    extend type Query {
        getTests(input: InputQuery): ResponseTests!
    }


    extend type Mutation {
        obliterateTest(input: InputValueString!): Response!
        obliterateTests(input: InputObliterateTests): Response!
    }


    type ResponseTest {
        status: Boolean!
        error: Error
        data: Test
    }

    type ResponseTests {
        status: Boolean!
        error: Error
        data: [Test!]
    }

    type Test {
        id: String!
        time: Int!
        status: Boolean!
        tester: String!
        phasesStatus: [Int!]!
    }


    input InputObliterateTests {
        filter: String
        ids: [String!]
    }


    extend type Query {
        getTokens: ResponseClientTokens!
    }


    extend type Mutation {
        generateToken(input: InputGenerateToken!): ResponseToken!
        obliterateToken(input: InputValueString!): Response!
    }


    type ResponseToken {
        status: Boolean!
        error: Error
        data: Token
    }

    type ResponseClientTokens {
        status: Boolean!
        error: Error
        data: [ClientToken!]
    }

    type Token {
        id: ID!
        name: String!
        value: String!
        startsWith: String!
    }

    type ClientToken {
        id: ID!
        name: String!
        startsWith: String!
    }

    extend type Owner {
        tokens: [ClientToken!]!
    }


    input InputGenerateToken {
        name: String!
    }
`;
