# Contributing

Thanks for contributing. This repository is a curated library of reusable Vega and Vega-Lite specifications for BI teams.

A good contribution should be practical, easy to preview with sample data, and easy to reuse by mapping documented input fields to local data.

## Good Fit For The Library

Specs should show a clear use case, such as an operational dashboard component, KPI visual, scheduling view, tracker, or other reusable BI pattern.

The most useful specs are portable across teams and do not depend too heavily on one organisation, report, or database schema. A strong contribution will usually:

- solve a recognisable reporting or analytical problem
- use synthetic sample data
- use neutral, systematic field names
- keep the required input fields minimal
- can be reused by mapping fields, rather than rewriting the spec
- are polished enough to be useful without a large redesign

Maintainers may suggest consolidating similar specs when one more general pattern would be more useful for the library.

## Spec Structure

Each contribution should live in its own folder under `specs/`:

```text
specs/
  example-spec-name/
    meta.json
    spec.json
    sample-data.json
```

Use a short, kebab-case folder name. The required files are:

- `meta.json`: title, category, description, tags, and documented input fields
- `spec.json`: the Vega or Vega-Lite specification
- `sample-data.json`: synthetic data used by the gallery preview

Sample data must not include patient-identifiable, staff-identifiable, commercially sensitive, or production data.

## Input Fields

The input fields in `meta.json` should describe the data someone needs to provide to reuse the spec.

Keep this list as small as possible. Field names should describe their role in the chart, not the source system they came from. For example, prefer names like `slot_start_at`, `case_status`, or `measure_1`.

Each field should have a type, such as `string`, `number`, `datetime`, or `boolean`, and a short description of how it is used. Avoid organisation-specific names, unnecessary fields, and behaviour that can only be understood by reading the sample data.

Existing input fields are treated as part of the public contract for a spec. Avoid changing them unless there is a clear benefit, and explain any breaking change in the pull request.

## Quality Checklist

Before opening a pull request, check that:

- renders correctly in the gallery
- sample data demonstrates the main visual states
- labels, legends, colours, and tooltips are readable
- handles empty, null, or in-progress values where those are part of the pattern
- the spec does not rely on external data URLs or brittle dependencies
- custom styling is purposeful and maintainable
- the project check passes with `npm run check`

Accessibility and readability matter. Avoid colour-only meaning where possible, and keep text legible at normal dashboard sizes.

## Review And Ownership

Maintainers review contributions for usefulness, clarity, portability, and maintainability. They may suggest changes to naming, metadata, sample data, styling, or scope before accepting a spec.

Once a spec is merged, it becomes part of the shared library. The original contributor is welcome to keep improving it, but maintainers and other contributors may also update it for bug fixes, gallery compatibility, clearer metadata, accessibility, or visual polish.

Keep pull requests focused. For a new spec, include the spec folder and any necessary metadata or gallery changes. For updates to an existing spec, explain what changed and whether the input fields are affected.

Run `npm run check` before submitting. Use `npm run dev` to preview the gallery locally.
