import os.path



def update_readme(
    root_path: str,
    readme_paths: list,
):
    readme_source_path = os.path.join(
        root_path,
        'README.md',
    )
    with open(readme_source_path, 'r') as source:
        readme_data = source.readlines()


    for readme_path in readme_paths:
        readme_update_path = os.path.join(
            root_path,
            readme_path,
        )

        print('Wrote readme in ' + readme_update_path)

        with open(readme_update_path, 'w') as update:
            update.writelines(readme_data)


def main():
    root_path = os.path.split(os.path.dirname(__file__))[0]

    readme_paths = [
        'packages/delog-client/delog-cli/README',
        'packages/delog-client/delog-javascript/README',
        'packages/delog-client/delog-python/README',
        'packages/delog-server/README',
    ]

    update_readme(
        root_path,
        readme_paths
    )


main()