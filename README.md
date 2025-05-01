# todo

- [ ] improve LLM agents result
- [ ] add optimistic loading, page transition, ...
- [x] fix current attempt is mistaken as ongoing even though it was already submitted
- [x] add try/catch for database operations in quiz attempt
- [x] save current attempt into database when: starting quiz (ensure persistant even after refreshing page), every changes, user submits, out of time
- [x] apply quiz config when creating new quiz attempt (shuffle questions, ...)
- [x] allow user to see previous attempts with given config (shuffle order, timelimit, correct choices, ...)