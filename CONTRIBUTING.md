# Contributing

## General Workflow

1. Fork the repo
1. Cut a namespaced feature branch from master
  - bug/...
  - feat/...
  - test/...
  - doc/...
  - refactor/...
1. Make commits to your feature branch. Prefix each commit like so:
  - (feat) Added a new feature
  - (fix) Fixed inconsistent tests [Fixes #0]
  - (refactor) ...
  - (cleanup) ...
  - (test) ...
  - (doc) ...
1. When you've finished with your fix or feature, Rebase upstream changes into your branch. submit a [pull request][]
   directly to master. Include a description of your changes.
1. Your pull request will be reviewed by another maintainer. The point of code
   reviews is to help keep the codebase clean and of high quality and, equally
   as important, to help you grow as a programmer. If your code reviewer
   requests you make a change you don't understand, ask them why.
1. Fix any issues raised by your code reviwer, and push your fixes as a single
   new commit.
1. Once the pull request has been reviewed, it will be merged by another member of the team. Do not merge your own commits.

## Detailed Workflow

### Fork the repo

Use github’s interface to make a fork of the repo, then add that repo as an upstream remote:

```
git remote add upstream https://github.com/realisticjackdaw/watchly.git
```

### Cut a namespaced feature branch from master

Your branch should follow this naming convention:
  - bugfix
  - feature
  - test
  - docs
  - refactor

These commands will help you do this:

``` bash

# Creates your branch and brings you there
git checkout -b `your-branch-name`
```

### Make commits to your feature branch. 

Prefix each commit like so
  - (feature) Added a new feature
  - (bugfix) Fixed inconsistent tests [Fixes #0]
  - (refactor) ...
  - (cleanup) ...
  - (test) ...
  - (docs) ...

Make changes and commits on your branch, and make sure that you
only make changes that are relevant to this branch. If you find
yourself making unrelated changes, make a new branch for those
changes.

#### Commit Message Guidelines

- Commit messages should be written in the present tense; e.g. "Fix continuous
  integration script".
- The first line of your commit message should be a brief summary of what the
  commit changes. Aim for about 70 characters max. Remember: This is a summary,
  not a detailed description of everything that changed.
- If you want to explain the commit in more depth, following the first line should
  be a blank line and then a more detailed description of the commit. This can be
  as detailed as you want, so dig into details here and keep the first line short.

### Rebase upstream changes into your branch

Once you are done making changes, you can begin the process of getting
your code merged into the main repo. Step 1 is to rebase upstream
changes to the master branch into your cut branch (feature, bugfix, etc.) by running this command
from your branch:

```bash
git pull --rebase upstream master
```

This will start the rebase process. You must commit all of your changes
before doing this. If there are no conflicts, this should just roll all
of your changes back on top of the changes from upstream, leading to a
nice, clean, linear commit history.

If there are conflicting changes, git will pause rebasing to allow you to sort
out the conflicts. You do this the same way you solve merge conflicts,
by checking all of the files git says have been changed in both histories
and picking the versions you want. Be aware that these changes will show
up in your pull request, so try and incorporate upstream changes as much
as possible.

You pick a file by `git add`ing it - you do not make commits during a
rebase.

Once you are done fixing conflicts for a specific commit, run:

```bash
git rebase --continue
```

This will continue the rebasing process. Once you are done fixing all
conflicts you should run any existing/new tests to make sure that everything works properly.

If rebasing broke anything, fix it, then repeat the above process until
you get here again and nothing is broken and all the tests pass.

### Make a pull request

Make a clear pull request from your fork and branch to the upstream master
branch, detailing exactly what changes you made and what feature this
should add. The clearer your pull request is the faster you can get
your changes incorporated into this repo.

At least one other person MUST give your changes a code review, and once
they are satisfied they will merge your changes into upstream. Alternatively,
they may have some requested changes. You should make more commits to your
branch to fix these, then follow this process again from rebasing onwards.

Once you get back here, make a comment requesting further review and
someone will look at your code again. If they like it, it will get merged,
else, just repeat again.

**Pull requests should be small and occur often.**  Strive to fix one small thing in each pull request.

### Bringing in changes from other local branches, if any

If you need to merge two local branches for some reason, use the following workflow:

Say you are merging local branch bugfix into local branch feature

From local branch feature... 
1. git pull --rebase upstream master
1. Checkout bugfix
1. git rebase feature
1. Checkout feature
1. git merge --ff-only bugfix 

Now your feature branch will have incorporated the bugfix branch.  From here you can run your tests, push 
to your remote repo's "feature" branch, then submit a pull request to the main repo's master branch.

### Guidelines

1. Uphold the current code standard:
    - Keep your code [DRY][].
    - Leave code cleaner than you found it.
    - Follow [STYLE-GUIDE.md](STYLE-GUIDE.md)
1. Run tests the before submitting a pull request.
1. Submit tests if your pull request contains new, testable behavior.
1. Your pull request is comprised of a single, squashed commit.

## Checklist:

- [ ] Fork own remote copy of the repo
- [ ] Clone local copy of forked remote repo
- [ ] Add upstream remote at https://github.com/realisticjackdaw/watchly.git  
- [ ] Cut work branch off of master (don't cut new branches from existing feature brances)
- [ ] Follow the correct naming convention for my branch
- [ ] Branch is focused on a single main change
- [ ] All changes/commits directly relate to this main change
- [ ] Rebase the upstream master branch after main change is made
- [ ] Run the tests
- [ ] Push cut branch to your own remote repo
- [ ] Make pull request from remote repo's cut branch to main repo's master branch
- [ ] Write a clear pull request message detailing what changes were made
- [ ] Get a code review
- [ ] Make any requested changes from that code review

<!-- Links -->
[style guide]: https://github.com/hackreactor-labs/style-guide
[n-queens]: https://github.com/hackreactor-labs/n-queens
[Underbar]: https://github.com/hackreactor-labs/underbar
[curriculum workflow diagram]: http://i.imgur.com/p0e4tQK.png
[cons of merge]: https://f.cloud.github.com/assets/1577682/1458274/1391ac28-435e-11e3-88b6-69c85029c978.png
[Bookstrap]: https://github.com/hackreactor/bookstrap
[Taser]: https://github.com/hackreactor/bookstrap
[tools workflow diagram]: http://i.imgur.com/kzlrDj7.png
[Git Flow]: http://nvie.com/posts/a-successful-git-branching-model/
[GitHub Flow]: http://scottchacon.com/2011/08/31/github-flow.html
[Squash]: http://gitready.com/advanced/2009/02/10/squashing-commits-with-rebase.html
