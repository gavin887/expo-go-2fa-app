const { withAppBuildGradle } = require('@expo/config-plugins');

const withAndroidSplits = (config) => {
    return withAppBuildGradle(config, (config) => {
        const buildGradle = config.modResults.contents;

        const splitsConfig = `
    applicationVariants.all { variant ->
        variant.outputs.each { output ->
            def abi = output.getFilter(com.android.build.OutputFile.ABI)
            if (abi != null) {
                output.outputFileName = "app-\${abi}-debug.apk"
            }
        }
    }

    splits {
        abi {
            enable true
            reset()
            include  "arm64-v8a", "x86_64"
            universalApk false
        }
    }
`;

        if (!buildGradle.includes('splits {')) {
            config.modResults.contents = buildGradle.replace(
                /android\s*{/,
                `android {\n${splitsConfig}`
            );
        }

        return config;
    });
};

module.exports = withAndroidSplits;