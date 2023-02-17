# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).


## [Unreleased]


## [0.2.3] - 2023-01-17
### Fixed
- Fix unexpected whitespace when output text when using tags not decorated with newlines.

## [0.2.2] - 2023-01-15
### Fixed
- Fix build to use .jsdoc.conf.json so that docs do not have dates.
- Fix date in changelog.

## [0.2.1] - 2023-01-15
### Added
- Support name and ident prefixes.
### Fixed
- Fix building docs over old docs.

## [0.2.0] - 2023-01-14
### Added
- Add replacement support.
- Add initial jsdocs.

## [0.1.3] - 2022-12-05
- Remove postinstall peggy-gen.
- Copy generated css-property.js on build.

## [0.1.2] - 2022-12-05
- Add support for HTML-to-Text using CSS properties
    - -text-begin
    - -text-end
    - -text-hide

## [0.1.1] - 2022-12-02
- Add additional meta mail items
    - mail/name
    - mail/ident
    - mail/from-email
    - mail/from-name
- Add source and ident options.

## [0.1.0] - 2022-11-23
### Added
- Change 'attr-' properties to '-attr-'.
- Add removeIds & removeClasses options to `buildFromString`. Both defaulting to `true`.

## [0.0.2] - 2022-11-22
### Added
- Fix copy and paste errors.
- Fix broken links.

## [0.0.1] - 2022-11-22
### Added
- Working `buildFromString` function.
- Initial release.
