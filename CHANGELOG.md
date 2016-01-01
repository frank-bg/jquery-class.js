
# Change Log

## 0.2.0 (2016-01-01)

- Rename/Update API:
  - (common) initialize => _initialize
  - (config) defaults.options => _options
  - (attributes) defaults.attributes => _attributes
  - (common) Remove default value for `delegate`
  - (common) Let constructor to call `delegate` with `/^_/`
- Add module manager:
  - `$.exports` to define module
  - `$.require` to use module

## 0.1.2 (2014-07-08)

- (common) let `delegate` method allows empty argument (default is /^on[A-Z]/)

## 0.1.1 (2014-06-19)

- (common) add `delegate` method to bind function to the instance

## 0.1.0 (2014-03-07)

- `use` array accepts object, function or other class-like object
- `_init[Name]` method changed to `initialize`
- `types` renamed to `modules`
