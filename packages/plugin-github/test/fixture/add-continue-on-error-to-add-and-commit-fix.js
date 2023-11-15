__putout_processor_yaml({
    name: "Node CI",
    on: ["push", "pull_request"],
    jobs: {
        build: {
            "runs-on": "ubuntu-latest",
            "steps": [{
                "uses": "actions/checkout@v4"
            }, {
                "uses": "oven-sh/setup-bun@v1",
                "with": {
                    "bun-version": "latest"
                }
            }, {
                "name": "Use Node.js ${{ matrix.node-version }}",
                "uses": "actions/setup-node@v4",
                "with": {
                    "node-version": "${{ matrix.node-version }}"
                }
            }, {
                "name": "Commit fixes",
                "uses": "EndBug/add-and-commit@v9",
                "continue-on-error": true
            }]
        }
    }
});
