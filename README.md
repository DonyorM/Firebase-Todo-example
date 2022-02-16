# Firebase-Todo-example
Pure Javascript Todo list showing interaction with Firebase. Actual list functionality comes from https://github.com/devmayor/Pure-Javascript-Todo-list

## Running the code

First, be sure to set up a proper firestore setup config in `index.html` (starting on line 71). The one in this repository is on my personal account and I may delete it at any time. For learning purposes you can just set up your own [firebase project](https://firebase.google.com/docs/web/setup)

Then simply start an HTTP server in this directory. I personally use python:
`python -m http.server` (requires python3)

## Stepping through the workshop

You can step through different by checkout out the following git tags:

`git checkout base`: starts the workshop with no firebase added, except the project config
`git checkout auth`: jumps to the authentication commit
`git checkout firestore`: jumps to the firestore commit

If you want to try and code through on your own, you can start a new branch at any of the tag points with `git checkout tags/{tagname} -b {branchname}`. Replace `{tagname}` with the name of the tag you want to start from and `{branchname}` with the new name of your branch.