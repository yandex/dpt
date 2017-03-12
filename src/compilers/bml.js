import '../vendor/beast';

export default function bml(input, {path}) {
    return {
        content: {
            body: Beast.parseBML(input)
        },
        dependencies: [path]
    };
}
