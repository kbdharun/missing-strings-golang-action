# Missing Strings Golang Action

This GitHub Action detects missing translation strings in Golang projects. It has been updated to use JavaScript instead of Docker for its execution environment.

## Usage

To use this action in your workflow, add the following step:

```yaml
- name: Check Missing Translations
  uses: kbdharun/missing-strings-golang-action@v1
  with:
    locale_file: 'path/to/locale/file.yml'
    root: 'path/to/project/root'
```

This action runs using Node.js and requires the project root and the path to the default locale file as inputs. It scans the Golang files for missing translation strings and fails the action if any are found, ensuring that all translation strings are properly defined.

## Inputs

- `locale_file`: The path to the default locale file. Default is 'locales/en.yml'.
- `root`: The project root directory. Default is '.'.

## Outputs

- The action will fail with an error message if missing translation strings are detected.
