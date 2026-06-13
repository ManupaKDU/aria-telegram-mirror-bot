1. **Analyze the Security Issue**:
   - The file `src/drive/drive-list.ts` generates HTML links for file results from Google Drive using `files[i]['name']`.
   - The bot sends these messages with `parse_mode: 'HTML'`, which allows HTML injection if `files[i]['name']` contains HTML tags (e.g., `<script>`).

2. **Implement Fix**:
   - Create a simple HTML escaping utility function. I can either add it to an existing utilities file (like `src/bot_utils/msg-tools.ts` or `src/bot_utils/utils.ts` if it exists) or directly in `src/drive/drive-list.ts` since it's a small function. To keep it localized, I'll add a helper function `escapeHTML` directly in `src/drive/drive-list.ts` that escapes `&`, `<`, `>`, `"`, and `'`. Or perhaps `src/bot_utils/msg-tools.ts` is a better place if other files need it, but let's check `src/bot_utils/msg-tools.ts`. It doesn't have it. I'll add `escapeHTML` to `src/bot_utils/msg-tools.ts` and import it in `drive-list.ts` and `index.ts` where needed. Wait, actually I will add it to `src/bot_utils/msg-tools.ts` and export it, then use it in `src/drive/drive-list.ts`.

3. **Verify Fix**:
   - Run the test suite using `npx jest` or similar command.
   - I will create a small test case to verify `generateFilesListMessage` (which I might need to extract or test via `listFiles` indirectly if possible, but actually `generateFilesListMessage` is not exported. I will export `generateFilesListMessage` for testing or add a test for it).
   - Write tests for `escapeHTML`.

4. **Complete pre-commit steps to ensure proper testing, verification, review, and reflection are done.**

5. **Submit the PR with the security fix details.**
