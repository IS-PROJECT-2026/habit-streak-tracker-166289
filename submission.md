<img width="1715" height="832" alt="image" src="https://github.com/user-attachments/assets/907b4228-0018-4128-903f-41e92a31d2cf" /><img width="1590" height="907" alt="image" src="https://github.com/user-attachments/assets/1800d1c3-f574-426d-95b3-cce194d5a845" /><img width="678" height="502" alt="image" src="https://github.com/user-attachments/assets/ea65a058-29a8-4f82-9f76-bed35dd90cd1" /># Project Submission Report

## 1. Student Details

- **Full Name:** Tevin Muchiri Ngiru
- **GitHub Username:** Tevin-Muchiri
- **Email:** tevin.ngiru@strathmore.edu

---

## 2. Deployed Project Link

- **Live GitHub Pages URL:** [https://is-project-2026.github.io/habit-streak-tracker-166289/]

---

## 3. Reflection — Grounded in Your Git History

> **Rules:** Every answer below **must include a direct link** to the specific commit, PR, issue, or branch in your repository that demonstrates what you are describing. Answers without working links will not be graded. Generic explanations that could apply to any project will receive zero marks.
>
> **Marks:** A (2 marks) · B (1 mark) · C (1 mark) · D (1 mark) = **5 marks total**

### A. Your Best Commit

Paste the URL of the commit in your history that you think best demonstrates clean conventional commit practice (good type tag, clear subject, meaningful body or footer).

- **Commit URL:** [https://github.com/IS-PROJECT-2026/habit-streak-tracker-166289/commit/5b7c87276abc2eb79239f8da118f452678ab2882]
- **Why this one?** his commit follows the Conventional Commits format and maintains the imperative mood throughout both the subject and body. It also represents a meaningful milestone in the project by consolidating refactoring, testing, and final application improvements before deployment. The message is concise, action-oriented, and clearly communicates the purpose of the change.

### B. A Mistake or Struggle

Link to a commit, PR, or issue where something went wrong — a bad commit message you had to fix, a branch you had to delete and recreate, a PR that needed rework, or a deployment that broke. 

- **Link to the evidence:**
  
conflict title a - [https://github.com/IS-PROJECT-2026/habit-streak-tracker-166289/pull/36]

conflict title b - [https://github.com/IS-PROJECT-2026/habit-streak-tracker-166289/pull/35]


- **What happened and how did you recover?** During the merge-conflict exercise, I created the original conflict branches (fix/15-conflict-title-a and fix/15-conflict-title-b) but opened and closed the pull requests in an incorrect sequence. This left the branches in a state that made it difficult to complete the required conflict workflow. Instead of forcing a repair on the original branches, I created new branches (fix/15-conflict-demo-a and fix/15-conflict-demo-b) from a clean state and repeated the exercise following the correct order. This allowed me to generate the conflict successfully, capture the required evidence, resolve the conflict manually, and complete the merge process cleanly.

### C. A Pull Request You're Proud Of

Paste the URL of the PR that best shows your self-review process — one where the description is clear, the issue linkage is correct, and the diff tells a coherent story.

- **PR URL:** [https://github.com/IS-PROJECT-2026/habit-streak-tracker-166289/pull/39]
- **What did you check before merging?** Before merging, I reviewed the file differences to ensure the HTML, CSS, and JavaScript changes were consistent with the project's final requirements. I verified that the application still functioned correctly after the refactoring, checked that no unintended files were modified, confirmed that the linked issue (#17) would close automatically, and ensured the branch was up to date before completing the merge.

### D. One Thing You Would Do Differently

If you had to restart this project from scratch with everything you know now, name one specific workflow decision you would change (not a code change — a Git/project management decision).

- **What would you change?** I would perform the merge-conflict exercises earlier in the project lifecycle instead of after many additional merges had already been completed. Performing them earlier would have reduced branch complexity, avoided confusion with closed pull requests, and made the conflict workflow easier to manage and document.
  
- **Link to the evidence of the original decision:** [https://github.com/IS-PROJECT-2026/habit-streak-tracker-166289/pull/35]

---

## 4. Screenshots of Key GitHub Features

Demonstrate your workflow mechanics by embedding your screenshots below.

> **CRITICAL FOR WORKING IMAGES:** Do not type manual folder paths. Edit this file directly on the GitHub web interface, click on the blank line below each prompt, and **paste (Ctrl+V / Cmd+V)** your screenshot. GitHub will automatically upload the file and generate a permanent, working image link for you.

### A. Milestones and Issues
*Provide a screenshot showing your active milestone(s) and the granular tracking issues linked directly to them.*

#### Initial screenshot before linking issues to the 

<img width="678" height="502" alt="image" src="https://github.com/user-attachments/assets/12b299b4-01f8-440e-9b49-3485df6ffe41" />

* **Caption:** Three milestones — Foundation, Habit Tracking Features, and Refinement & Submission, each with granular, individually tracked issues linked directly to them, showing 100% completion for each.

### B. Project Board
*Provide a screenshot of your GitHub Project Board with your issues organized dynamically across columns (To Do, In Progress, Done).*
<img width="778" height="631" alt="image" src="https://github.com/user-attachments/assets/1ac181a8-6e2a-469d-b973-7df421cf8c14" />
* **Caption:** [Complete Board before beginning the tasks]

<img width="1432" height="683" alt="image" src="https://github.com/user-attachments/assets/b0512c84-7d22-46a1-9310-0c9118f6b52a" />
* **Caption:** [Day 1 Board - Before beginning the tasks]

<img width="1051" height="910" alt="image" src="https://github.com/user-attachments/assets/46f84e06-b3b4-4ede-9ef8-96b4cdaf4863" />
* **Caption:** [Final board after completing all the issues and milestones]

### C. Branching Architecture
*Provide a screenshot showing your local or remote Git branch list, highlighting your use of conventional, issue-linked naming patterns (e.g., `feat/`, `fix/`, `style/`).*

The project followed a feature-branch workflow where work was completed on separate issue-linked branches and merged into main through pull requests. As part of repository maintenance, merged branches were deleted after successful integration. Therefore, the branch names are demonstrated through the closed pull request history, which preserves evidence of the branching strategy and naming conventions used throughout the project.

<img width="907" height="191" alt="image" src="https://github.com/user-attachments/assets/05b01098-7a82-4303-a959-475c0ec150b1" />

<img width="1136" height="792" alt="image" src="https://github.com/user-attachments/assets/3f1a9c32-b3b3-4e25-a96e-8562b4cd7a4c" />

<img width="886" height="668" alt="image" src="https://github.com/user-attachments/assets/ec5613e3-a799-4bc8-85ee-631c5d928fe3" />

* **Caption:** [Closed pull requests showing the project's branching architecture and conventional issue-linked naming patterns, including feat/, fix/, style/, docs/, refactor/, and chore/ branches that were merged into main and subsequently deleted]

### D. Pull Requests & Traceability
*Provide a screenshot of a completed or open Pull Request (PR) on GitHub that clearly shows it is linked to a related development issue.*

<img width="938" height="901" alt="image" src="https://github.com/user-attachments/assets/f6142278-43cc-41b2-a65f-66c79a45c302" />

* **Caption:** [Pull request successfully merged into main and linked directly to Issue #16 (Complete submission.md), demonstrating traceability between project planning, implementation, and integration activities.] 

---

## 5. Merge Conflict Evidence

You must engineer **three merge conflicts**, each triggered by a **different cause** from those covered in the lecture. For Conflict 1, document the full resolution lifecycle. For Conflicts 2 and 3, provide the conflict marker screenshot and identify the cause.

> **Marks:** Conflict 1 full chronology (2 marks) · Conflict 2 (1 mark) · Conflict 3 (1 mark) · All three use distinct causes (1 mark) = **5 marks total**

---

### Conflict 1 — Full Chronology

**What cause did you use?** Same-line content conflict — two branches independently modified the same `<h1>` element in `index.html`.

#### Step 1: Generating the Clash
*Screenshot showing the merge attempt and the conflict warning.*

<img width="1402" height="328" alt="image" src="https://github.com/user-attachments/assets/b397ec55-41f3-4a64-b312-2d95810cf372" />


* **Caption:** Branches `fix/15-conflict-demo-a` and `fix/15-conflict-demo-b` modified the same `<h1>` line independently. Merging `main` into `fix/15-conflict-demo-b` produced a content conflict that required manual resolution.
#### Step 2: Inside the Code Editor (Conflict Markers)
*Screenshot showing the raw, unresolved conflict markers (`<<<<<<< HEAD`, `=======`, `>>>>>>>`) in your editor.*

<img width="1406" height="458" alt="image" src="https://github.com/user-attachments/assets/27e68588-0f97-4ad7-b35b-022ba808ff6c" />

* **Caption:** Raw Git conflict markers showing two competing versions of the `<h1>` wordmark. The conflict was resolved by selecting a single final title and removing the conflict markers.

#### Step 3: Resolution & Clean Merge
*Screenshot of your clean Git history or completed PR showing the conflict was resolved and merged.*

<img width="1622" height="902" alt="image" src="https://github.com/user-attachments/assets/40ed0d1f-d165-409a-bb3d-828a829c75af" />


* **Caption:** After resolving the content conflict, the changes were committed (`fix(conflict): resolve merge collision`), linked to Issue #15, and successfully merged into `main`. The pull request was closed and the feature branch was deleted after integration.

---

### Conflict 2 — Different Cause

**What cause did you use?** Add/add conflict — two branches independently created a file named `NOTES.md` with different contents.

**Why does this cause trigger a conflict?** Two branches independently created `NOTES.md` with different contents. Because both branches added the file without a common version to reconcile, Git produced an add/add conflict requiring manual resolution.

#### Step 1: Conflict Markers
<img width="1269" height="179" alt="image" src="https://github.com/user-attachments/assets/73adabb1-6532-42b7-9b88-4ddef4bff08f" />

* **Caption:** Git inserted conflict markers into `NOTES.md` after detecting that branches `fix/19-conflict2-addadd-a` and `fix/19-conflict2-addadd-b` had both created the same file with different contents.

#### Step 2: Terminal Evidence
<img width="1533" height="133" alt="image" src="https://github.com/user-attachments/assets/9975c600-e97e-47d6-9b48-2d21fd7cc2da" />

* **Caption:** Terminal output confirming the add/add conflict. Git could not automatically determine which version of `NOTES.md` should be retained and therefore required manual resolution.
---

### Conflict 3 — Modify/Delete Conflict

**What cause did you use?**  
Modify/delete conflict — one branch deleted a file while another branch modified the same file.

**Why does this cause trigger a conflict?**  
One branch removed `docs/legacy-notes.md` while another branch updated its contents. Because Git could not automatically determine whether the file should be retained or removed, it generated a modify/delete conflict requiring manual intervention.

#### Evidence

<img width="1526" height="132" alt="image" src="https://github.com/user-attachments/assets/2e2b1b7d-0e85-499e-84f8-28864eff43f2" />

* **Caption:** Branch `fix/20-conflict3-deletemodify-a` deleted `docs/legacy-notes.md` while `fix/20-conflict3-deletemodify-b` modified it. Git flagged the file as a modify/delete conflict until a manual resolution was performed.
## 6. Feedback & Evaluation

To help improve this course for future engineering cohorts, please take 2 minutes to fill out the anonymous feedback form. Your honest review helps shape how this program is taught next semester!
- [ ] **Anonymous Evaluation Form:** [Course & Instructor Evaluation](https://forms.gle/YLybnsyXXErKEg3s9)

---
 
## Final Submission
 
Once your repository is complete, submit your work through the official submission form below. The form will **stop accepting responses after Monday, August 17th, 2026** — no late submissions will be accepted.
 
> **Submission Form:** [https://forms.gle/KrT4VxtFtkU3wtYu8](https://forms.gle/KrT4VxtFtkU3wtYu8)
