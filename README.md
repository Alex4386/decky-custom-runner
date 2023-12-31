<h1 align="center">Decky Custom Runner</h1>
<p align="center">Run launchers or other binaries while in game-mode. <a href="https://youtu.be/OGEbivDFkug">Watch a demo</a></p>

![custom runner](https://github.com/Alex4386/decky-custom-runner/assets/27724108/5d98d46e-9108-43a9-ad66-a2020cd93b5e)

## What can it do?
* Run a launcher in some games that require custom launchers
* Launch configuration utility available in the game folder

## Build Instructions
### Prerequisites
* Linux Installation <sup>(for prebuilt Decky Loader CLI)</sup> or Rust **NIGHTLY** installation on POSIX Compliant OS <sup>(e.g. macOS)</sup>
* Latest LTS version of NodeJS
* pnpm
* docker installation

### If you are not using Linux
If you are using something other POSIX compliant OS (or has docker user-rights properly configured), Please modify `.vscode/build.sh` or `.vscode/deploy.sh` not to use sudo, since Docker doesn't require sudo to run on macOS platform (running in Linux virtual machine). 

### How to Build
1. Resolve pnpm dependencies with `pnpm i` command
2. Create cli directory on repository root (`mkdir cli`)
3. Put compiled CLI binary ([Precompiled Linux binary](https://github.com/SteamDeckHomebrew/cli/releases/latest)) at `./cli/decky`
   - If you are using other POSIX compliant OS, clone the repo and compile with `cargo build`.
   - If you are using Windows, Use WSL2 (Arch Linux preferred) and setup all of prerequisites.
4. run `pnpm build-zip`
5. Enter sudo password if requested.  
   (Required for compiling for holo-iso environment)
6. Your bundle is now available at `./out/Custom Runner.zip`. Enjoy!

## License
Distributed under BSD-3-Clause License  
