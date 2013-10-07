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
                v0.0.3
            </td>
        </tr>
        <tr>
            <td>library/</td>
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
                            <td>0.0.3</td>
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
                            <td>Kevoree Runtime in your browser (Google Chrome only)</td>
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
                This project is used to create <strong>kevoree-library</strong> and <strong>kevoree-kotlin</strong> projects
            </td>
        </tr>
        <tr>
            <td>tools/</td>
            <td>Contains kevoree-gen-model (to generate kevoree models from components sources)</td>
        </tr>
        <tr>
            <td>extras/</td>
            <td>Kevoree dependencies not found in npm</td>
        </tr>
    </tbody>
</table>