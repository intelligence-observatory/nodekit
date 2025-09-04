// The below must be declared for TypeScript to understand CSS imports:

declare module '*.css' {
    const content: string;
    export default content;
}
