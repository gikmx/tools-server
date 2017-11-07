# [@gik/tools-server](http://gik.mx) *0.0.5*
> A minimal web server. Part of our [tools suite](https://github.com/gikmx/tools).

##### Contributors
- [Héctor Menéndez](mailto:hector@gik.mx) []()

##### Supported platforms
- linux
- darwin

#### <a name="table-of-contents"></a> Table of contents
- **[server](#server)** A minimal webserver using [RxJS Observables](https://github.com/reactivex/rxjs).


# <a name="server"></a> server

A minimal webserver using [RxJS Observables](https://github.com/reactivex/rxjs).
> - [Standalone version](https://github.com/gikmx/tools-streamer).
> - [Report a Bug](https://github.com/gikmx/tools-streamer/issues).

###### Parameters
<table>
    <tr>
        <td style="white-space: nowrap;">
            <code>[config]</code>
        </td>
        <td style="white-space: nowrap;">
                <a href="#Object">Object</a>
        </td>
        <td>The configuration for the server.</td>
    </tr><tr>
        <td style="white-space: nowrap;">
            <code>[config.subscription]</code>
        </td>
        <td style="white-space: nowrap;">
                <a href="#boolean">boolean</a>
        </td>
        <td>Should the server should be started right away. <b>Default <code>true</code></b></td>
    </tr><tr>
        <td style="white-space: nowrap;">
            <code>[config.routes]</code>
        </td>
        <td style="white-space: nowrap;">
                <a href="#string">string</a>
        </td>
        <td>The location for the routes file. <b>Default <code>CWD/routes.json</code></b></td>
    </tr><tr>
        <td style="white-space: nowrap;">
            <code>[config.handlers]</code>
        </td>
        <td style="white-space: nowrap;">
                <a href="#string">string</a>
        </td>
        <td>The location for the handlers folder. <b>Default <code>CWD/handlers</code></b></td>
    </tr><tr>
        <td style="white-space: nowrap;">
            <code>[config.port]</code>
        </td>
        <td style="white-space: nowrap;">
                <a href="#string">string</a>
        </td>
        <td>The port to use when starting the server.
The <code>PORT</code> environment variable can also be used to set this. <b>Default <code>3333</code></b></td>
    </tr><tr>
        <td style="white-space: nowrap;">
            <code>[config.host]</code>
        </td>
        <td style="white-space: nowrap;">
                <a href="#string">string</a>
        </td>
        <td>The host to use when starting the server.
The <code>HOST</code> environment variable can also be used to set this. <b>Default <code>0.0.0.0</code></b></td>
    </tr><tr>
        <td style="white-space: nowrap;">
            <code>[config.handler404]</code>
        </td>
        <td style="white-space: nowrap;">
                <a href="#function">function</a>
        </td>
        <td>The default handler for routes without handler.</td>
    </tr><tr>
        <td style="white-space: nowrap;">
            <code>[config.onNext]</code>
        </td>
        <td style="white-space: nowrap;">
                <a href="#function">function</a>
        </td>
        <td>When subscription mode is enabled this is called
whenever the server inits or a request was handled.</td>
    </tr><tr>
        <td style="white-space: nowrap;">
            <code>[config.onError]</code>
        </td>
        <td style="white-space: nowrap;">
                <a href="#function">function</a>
        </td>
        <td>When subscription mode is enabled this is called
whenever an error is thrown.</td>
    </tr>
</table>


###### Returns
 [`Subscription`](#Subscription) [`Observable`](#Observable) <span style="font-weight:normal"> - if subscription mode was enabled
a subscription would be returned, otherwise an observable is returned.</span>

<small>**[▲ Top](#table-of-contents)**</small>

---

