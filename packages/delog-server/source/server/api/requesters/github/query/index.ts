// #region imports
    // #region libraries
    import {
        gql,
        DocumentNode,
    } from '@apollo/client';
    // #endregion libraries
// #endregion imports



// #region module
export const VIEWER_LOGIN: DocumentNode = gql`
    query {
        viewer {
            login
        }
    }
`;


export const QUERY_REPOSITORIES: DocumentNode = gql`
    query {
        viewer {
            repositories(
                first: 100,
                affiliations:[OWNER, ORGANIZATION_MEMBER, COLLABORATOR]
                ownerAffiliations: [OWNER, ORGANIZATION_MEMBER, COLLABORATOR]
                orderBy: {
                    field: NAME,
                    direction: ASC
                }
            ) {
                totalCount
                nodes {
                    nameWithOwner
                    databaseId
                    isPrivate
                }
                pageInfo {
                    endCursor
                    hasNextPage
                }
            }
        }
    }
`;


export const QUERY_REPOSITORY_BY_NAME_OWNER: DocumentNode = gql`
    query QueryRepositoryByNameOwner($name: String!, $owner: String!) {
        repository(
            name: $name
            owner: $owner
        ) {
            nameWithOwner
            name
            databaseId
            isPrivate
            defaultBranchRef {
                target {
                    ... on Commit {
                        zipballUrl
                    }
                }
            }
        }
    }
`;
// #endregion module
