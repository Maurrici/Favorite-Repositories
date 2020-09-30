import api from './api'

export default class App{
    constructor(){
        this.repositories = JSON.parse(localStorage.getItem('repositoriesSaves')) || []
        this.formEl = document.querySelector('#repo-form')
        this.inputEl = document.querySelector('input[name=repository]')
        this.listEl = document.querySelector('#repo-list')
        this.registerHandlers()
        this.render()
    }

    registerHandlers(){
        this.formEl.onsubmit = event => this.addRepository(event)
    }

    setLoading(loading = true){
        if(loading == true){
            let loadingEl = document.createElement('p')
            loadingEl.appendChild(document.createTextNode('Buscando Repositório...'))
            loadingEl.setAttribute('id', 'loading')

            document.querySelector('section#search').appendChild(loadingEl)
        }else{
            document.querySelector('#loading').remove()
        }
    }

    async addRepository(event){
        event.preventDefault()

        const nameRepo = this.inputEl.value 
        
        if(nameRepo.length === 0) return

        this.setLoading()
        try{
            const response = await api.get(`/repos/${nameRepo}`)
            
            const {name, description, html_url, owner:{avatar_url}} = response.data
            this.repositories.push({
                name,
                description,
                avatar_url,
                html_url
            })
    
            this.render()
            this.saveToStorage()

        }catch(err){
            alert('Repositório não foi encontrado')
        }
        
        this.setLoading(false)
    }

    render(){
        this.listEl.innerHTML = ""

        this.repositories.forEach(repo => {
            //Imagem
            let imgEl = document.createElement('img')
            imgEl.setAttribute('src', repo.avatar_url)

            //Título
            let titleEl = document.createElement('strong')
            titleEl.appendChild(document.createTextNode(repo.name))

            //Descrição
            let descriptionEl = document.createElement('p')
            descriptionEl.appendChild(document.createTextNode(repo.description))

            //Link
            let linkEl = document.createElement('a')
            linkEl.setAttribute('target', '_blank')
            linkEl.setAttribute('href', repo.html_url)
            linkEl.className = 'clearfix btn btn-dark'
            linkEl.appendChild(document.createTextNode('Acessar Repositório'))

            //List Item
            let listItemEl = document.createElement('li')
            listItemEl.appendChild(imgEl)
            listItemEl.appendChild(titleEl)
            listItemEl.appendChild(descriptionEl)
            listItemEl.appendChild(linkEl)

            //Adicionando a lista
            this.listEl.appendChild(listItemEl)
        })
    }

    saveToStorage(){
        localStorage.setItem('repositoriesSaves', JSON.stringify(this.repositories))
    }
}