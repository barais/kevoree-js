# Kevoree-JS #

/!\ Work in progress /!\

### Project description: ###

<table>
    <thead>
        <th>Folders</th>
        <th>Descriptions</th>
    </thead>
    
    <tbody>
        <tr>
            <td>core/</td>
            <td>
                Kevoree Core bundled as a NodeJS npm module<br/>
                v0.0.1
            </td>
        </tr>
        <tr>
            <td>module/</td>
            <td>
                <table>
                    <thead>
                        <th>Name</th>
                        <th>Version</th>
                        <th>Description</th>
                    </thead>
                    <tbody>
                        <tr>
                            <td>kevoree-node</td>
                            <td>0.0.6</td>
                            <td>NodeJS Kevoree Platform</td>
                        </tr>
                        <tr>
                            <td>kevoree-library</td>
                            <td>0.0.1</td>
                            <td>Kevoree Library bundled as a NodeJS npm module</td>
                        </tr>
                        <tr>
                            <td>kevoree-comp-helloworld</td>
                            <td>0.0.2</td>
                            <td>Kevoree Component Entity that displays a Hello World</td>
                        </tr>
                        <tr>
                            <td>kevoree-group-websocket</td>
                            <td>0.0.2</td>
                            <td>Kevoree Group Entity that handles model transfers with WebSockets</td>
                        </tr>
                    </tbody>
                </table>
            </td>
        </tr>
        <tr>
            <td>platform/</td>
            <td>
                <table>
                    <thead>
                        <th>Name</th>
                        <th>Type</th>
                    </thead>
                    <tbody>
                        <tr>
                            <td>browser</td>
                            <td>NOT IMPLEMENTED YET</td>
                        </tr>
                        <tr>
                            <td>nodejs</td>
                            <td>Kevoree Runtime allowing you to run a Kevoree Platform on NodeJS</td>
                        </tr>
                    </tbody>
                </table>
            </td>
        </tr>
        <tr>
            <td>org.kevoree.model.js/</td>
            <td>
                Maven project allowing you to compile Kevoree model to JS easily<br/>
                This project is used to update <strong>kevoree-library.js</strong> in <strong>module/kevoree-library</strong>
            </td>
        </tr>
    </tbody>
</table>