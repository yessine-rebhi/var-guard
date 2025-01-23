
### Updated `CHANGELOG.md`

```markdown
# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.3.0] - 2024-02-20
### Added
- Full Vite.js support
- Vite-specific configuration options
- Enhanced static variable detection
- Vue/Svelte file support

## [0.2.0] - 2025-01-08
### Added

- Added detection for environment variables in jsx, tsx codebase files.
- Added detection for static environment variables in the codebase.
- Updated `generate` command to include static variable checks.

## [0.1.1] - 2025-01-03
### Added

- Added detection for static environment variables in the codebase.
- Updated `generate` command to include static variable checks.

## [0.1.0] - 2024-12-31
### Added

- Added `init` command to generate a default `.varsguardrc` configuration file.
- Added support for `.varsguardrc` configuration file.

### Changed

- Improved documentation in README.md to include details about the `init` command and configuration file.

## [0.0.10] - 2024-12-18
### Added

- Initial release of the library.
- Included core functionalities for environment variable validation, synchronization, and generation of `.env.example`.