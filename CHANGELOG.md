# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.1.1] - 2026-08-28

### Changed

- README: npm/CI/bundle-size badges, features list, and install commands for npm, pnpm, Yarn, and Bun
- Note that local development uses Bun

## [0.1.0] - 2026-08-28

### Added

- `createRenderSwitch` factory for switch-style UI branching with ordered case matching
- `<AsyncSwitch>` component for async loading, error, and empty states with `children` as the default ready content
- TypeScript types for cases, async switch props, and state variants
- Runnable examples for component, factory, and custom-state patterns
