# JCORE Lohko

The default block library for JCORE 3. Blocks are built with `@wordpress/scripts`
and rendered with Timber/Twig, so their markup lives next to the block source
rather than in the theme.

## Blocks

All blocks are registered under the `lohko/` namespace.

| Block | Type | What it does |
| --- | --- | --- |
| `lohko/header` | dynamic | Site header: optional logo, a registered menu, and inner blocks. |
| `lohko/footer` | dynamic | Footer with four content areas, their menus, and a copyright line. |
| `lohko/nav-header` | static | Wrapper that adds jutils scroll and sticky behaviour to a header. |
| `lohko/navigation` | dynamic | Full navigation with a hamburger, search toggle and submenus. |
| `lohko/simple-menu` | dynamic | A plain `<ul>` for one registered menu location. |
| `lohko/accordions` | static | Interactivity API accordion container. |
| `lohko/accordion-item` | static | A single accordion panel, only valid inside `lohko/accordions`. |
| `lohko/logocloud` | static | Centred, wrapping row of images. |
| `lohko/copyright-date` | dynamic | Company name with the current year, optionally as a range. |
| `lohko/rive-animation` | static | Renders a `.riv` animation on a canvas. |

> The namespace is `lohko/`, not `jcore/`: WordPress strips `core-` when it turns
> a block name into its `wp-block-*` class without checking that the match is at
> the start, so a `jcore/` namespace produces mangled class names.

## Requirements

- WordPress 6.8 or newer, for `wp_register_block_types_from_metadata_collection()`.
- PHP 8.2.
- Timber 2, provided by `jcore/ydin`.

The `shorten` Twig filter and the `jcore_global_content()` function used by the
navigation and footer templates come from `jcore/ydin`, which also stubs the
latter when `jcore-maailma` is not installed.

## Development

```
make install   Install dependencies.
make build     Build once.
make dev       Install, then watch.

pnpm lint:js       ESLint.
pnpm lint:css      Stylelint.
pnpm format        Prettier, WordPress style.
pnpm env:start     Start a wp-env instance with this plugin active.
```

The build writes `build/blocks-manifest.php`, which `lohko.php` uses to register
every block in one pass.

## Translations

Every block declares the `lohko` text domain. Regenerate the catalogue with
`pnpm make-pot`, then `pnpm make-json` for the editor scripts.

## Releases

Pushing to `main` runs [foonver](https://github.com/foonly/foonver), which bumps
the version from the commit messages, updates `CHANGELOG.md`, syncs the version
into `lohko.php` and `package.json`, and pushes the tag.
