export default ({ type, response, status, headers, body }) => {
    if (type !== 'request') return;
    response.writeHead(status || 200, headers || {});
    response.write(body);
    response.end();
};
