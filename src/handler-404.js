export default function NotFound() {
    return this.$.of({
        status: 404,
        headers: {
            'Content-Type': 'text/html',
        },
        body: '<h1>Not Found</h1>',
    });
}
