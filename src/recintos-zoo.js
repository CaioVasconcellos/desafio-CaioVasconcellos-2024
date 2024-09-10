class RecintosZoo {

    constructor() {
        this.recintos = [
            { nome: 'Recinto 1', biomaRecinto: ['savana'], espaçoTotal: 10, espacoLivre: 7, tipoAnimais: ['MACACO', 'MACACO', 'MACACO'] },
            { nome: 'Recinto 2', biomaRecinto: ['floresta'], espaçoTotal: 5, espacoLivre: 5, tipoAnimais: [] },
            { nome: 'Recinto 3', biomaRecinto: ['savana', 'rio'], espaçoTotal: 7, espacoLivre: 5, tipoAnimais: ['GAZELA'] },
            { nome: 'Recinto 4', biomaRecinto: ['rio'], espaçoTotal: 8, espacoLivre: 8, tipoAnimais: [] },
            { nome: 'Recinto 5', biomaRecinto: ['savana'], espaçoTotal: 9, espacoLivre: 6, tipoAnimais: ['LEAO'] }
        ];
        this.animaisHabilitados = [
            { nome: 'LEAO', tamanho: 3, bioma: ['savana'] },
            { nome: 'LEOPARDO', tamanho: 2, bioma: ['savana'] },
            { nome: 'CROCODILO', tamanho: 3, bioma: ['rio'] },
            { nome: 'MACACO', tamanho: 1, bioma: ['savana', 'floresta'] },
            { nome: 'GAZELA', tamanho: 2, bioma: ['savana'] },
            { nome: 'HIPOPOTAMO', tamanho: 4, bioma: ['savana', 'rio'] }
        ];
    }

    analisaRecintos(animalNome, quantidade) {

        if (quantidade <= 0 || isNaN(quantidade)) {
            return { erro: "Quantidade inválida" };
        }

        const animalHabilitado = this.animaisHabilitados.find(a => a.nome === animalNome);

        if (!animalHabilitado) {
            return { erro: "Animal inválido" };
        }

        const recintos = this.encontrarRecintoPeloBioma(animalHabilitado.bioma);

        const animaisVariaveis = recintos.map(recinto => {
            const espacoLivre = this.calcularEspacoLivre(recinto, animalHabilitado.nome);
        return {... recinto, espacoLivre}
    });

        const resultadoEspacoAdequado = animaisVariaveis
            .map(animaisVariaveis => this.verificarEspacoAdequado(animaisVariaveis, animalHabilitado.tamanho, quantidade))
            .filter(resultado => resultado !== null);

        const resultadoCarnivoro = this.verificarCarnivoro(resultadoEspacoAdequado, animalHabilitado.nome);
        const resultadoHipopotamo = this.verificarHipopotamo(resultadoCarnivoro, animalHabilitado.nome);
        const resultadoMacaco = this.verificarMacacoSozinho(resultadoHipopotamo, animalHabilitado.nome, quantidade);

        if (resultadoMacaco.length > 0) {
            return {
                recintosViaveis: resultadoMacaco.map(r =>
                    `${r.nome} (espaço livre: ${r.espacoLivre} total: ${r.espaçoTotal})`
                )
            };
        } else {
            return { erro: "Não há recinto viável" };
        }
    }

    encontrarRecintoPeloBioma(biomaDoAnimal) {
        return this.recintos.filter(recinto =>
            biomaDoAnimal.some(bioma => recinto.biomaRecinto.includes(bioma))
        );
    }

    calcularEspacoLivre(recinto, nomeAnimal) {
        const especiesDiferentes = recinto.tipoAnimais.some(animal => animal !== nomeAnimal);
        const espacoExtra = especiesDiferentes ? 1 : 0;
        return recinto.espacoLivre - espacoExtra;
    }


    verificarEspacoAdequado(recinto, tamanho, quantidade) {
        const espacoNecessario = tamanho * quantidade;
        const espaco = recinto.espacoLivre


        if (espaco >= espacoNecessario) {
            return {
                ...recinto,
                espacoLivre: espaco - espacoNecessario
            };
        } 
        return null;
    }


    verificarCarnivoro(recintos, nomeAnimal) {
        const carnivoros = ['LEAO', 'CROCODILO', 'LEOPARDO'];
        const animalEhCarnivoro = carnivoros.includes(nomeAnimal);

        return recintos.filter(recinto => {
            if (recinto.tipoAnimais.length > 0) {
                const temCarnivorosNoRecinto = recinto.tipoAnimais.some(animal => carnivoros.includes(animal));

                if (temCarnivorosNoRecinto) {
                    if (!animalEhCarnivoro) {
                        return false;
                    }
                    const apenasMesmaEspecie = recinto.tipoAnimais.every(animal => animal === nomeAnimal);
                    return apenasMesmaEspecie;
                }

                if (animalEhCarnivoro) {
                    return false;
                }
            }

            return true;
        });
    }

    verificarHipopotamo(recintos, nomeAnimal) {
        return recintos.filter(recinto => {
            if (nomeAnimal === 'HIPOPOTAMO') {
                const possuiSavanaERio = recinto.biomaRecinto.includes('savana') && recinto.biomaRecinto.includes('rio');

                if (!possuiSavanaERio && recinto.tipoAnimais.length > 0) {
                    return false;
                }
            }
            return true;
        });
    }

    verificarMacacoSozinho(recintos, nomeAnimal, quantidade) {
        return recintos.filter(recinto => {
            if (quantidade > 1) {
                return true;
            }
            else if (nomeAnimal === 'MACACO' && recinto.tipoAnimais.length === 0) {
                return false;
            }
            return true;
        });
    }

    



}

export { RecintosZoo as RecintosZoo };
