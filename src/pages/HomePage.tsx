const HomePage = () => {
    return (
        <div className="card bg-gray-600 text-primary-content">
            <h1 className="mb-3 text-indigo align-middle underline font-bold">Readme</h1>
            <div className="mockup-code mb-5">
                <h2 className="font-bold underline m-3 px-5 card-title">Description</h2>
                <div className="card-body bordered border-r-4 ml-3">
                        Une application frontend en React, qui va créer une application React qui affiche 2 Pages :
                        <ul className="list-disc">
                            <li>La liste des customers</li>
                            <li>La liste des orders pour un utilisateur</li>
                        </ul>
                </div>

                <div className="card-body bg-indigo-600 rounded bordered border-r-4 mt-4 ml-3">
                    <h3><code>npm install</code></h3>
                    <p>Commande à lancer avant de démarrer l'application.</p>
                </div>

                <div className="card-body bg-indigo-600 rounded bordered border-r-4 mt-4 ml-3">
                        <h3><code>npm run dev</code></h3>
                        <p>Lance l'application en mode développement. Ouvrez <code>http://localhost:5173</code> pour la voir
                            dans le navigateur.</p>
                        <p>Vous verrez également les erreurs de lint dans la console.</p>
                </div>

                <div className="card-body bg-indigo-600 rounded bordered border-r-4 mt-4 ml-3">
                    <h3><code>npm run test</code></h3>
                    <p>
                        Lance le lanceur de tests en mode interactif. Consultez la section sur l'exécution des tests pour
                        plus d'informations.
                    </p>
                </div>

                <div className="card-body bg-indigo-600 rounded bordered border-r-4 mt-4 ml-3">
                    <h3><code>npm run build</code></h3>
                    <p>
                        Construit l'application pour la production dans le dossier build. Elle regroupe correctement
                        React en
                        mode production et optimise la construction pour de meilleures performances.
                    La construction est minifiée et les noms de fichiers incluent des hachages. Votre application est
                    prête à être déployée !
                    </p>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
