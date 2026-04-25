# Recommendation graph schema

## Node labels

- `User`
- `Item`
- `Category`
- `Tag`

## Relationship types

- `INTERACTED` (`User -> Item`)
  - `rating`
  - `event`
  - `at`
- `IN_CATEGORY` (`Item -> Category`)
- `HAS_TAG` (`Item -> Tag`)

## Example questions

- Which items are popular among users similar to a target user?
- Which users liked the same items as a target item?
- Which items are content-similar by category and tag overlap?
- How do we combine collaborative and content-based scoring?
