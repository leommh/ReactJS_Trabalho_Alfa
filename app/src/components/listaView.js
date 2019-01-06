import React, {Component} from 'react';
import {Input, Table, Alert} from 'reactstrap';
import ListaViewItem from './listaViewItem';
import {desconcluiTarefa, concluiTarefa, editaTarefa, delTarefa, buscaTarefas} from '../components/Api';

import TaskForm from '../components/TaskForm';


class listaView extends Component {

    state = {
        tarefas : [], 
        inputTarefa: '',
        lista: [],
        busca:'',
    }

    lista = () => {
        let {busca} = this.state;
        buscaTarefas(busca).then(res => this.setState({lista: res.data}));
    }

    busca = (e) => {
        let valor = e.target.value;
        this.setState({busca:valor});
        this.lista();
    }

    removeTarefa = async (id) => {
        await delTarefa(id);
        this.lista();
    }

    editarTarefa = async (id, dados) => {
        await editaTarefa(id, dados);
        this.lista();
    }

    onChange = (event) => {
        const state = Object.assign({}, this.state);
        const campo = event.target.name;
        state[campo] = event.target.value;
        this.setState(state);
    }

    alterarEstado = async (id, status) => {
        if (status === 1){
            await desconcluiTarefa(id);
        } else {
            await concluiTarefa(id);
        }
        this.lista();
    }

    componentDidMount(){
        this.setState({busca:''});
        this.lista();
    }

    render () {

        const {lista} = this.state;

        return (
            <div>

                <h1>lista de tarefas</h1>
                <Input onChange={this.busca} value={this.state.busca} placeholder="busca por título" />

                { 
                    lista.length > 0 
                    ? (
                        <div>
                            <Table>
                                <tr>
                                    <th width='10'>Nº</th>
                                    <th>Título</th>
                                    <th>Descrição</th>
                                    <th width='50'>Concluida</th>
                                    <th width='150'>...</th>
                                </tr>
                                {
                                    lista.map ((tarefa, index) => 
                                        <ListaViewItem tarefa={tarefa} 
                                            index={index} 
                                            removeTarefa={this.removeTarefa} 
                                            editarTarefa={this.editarTarefa} 
                                            alterarEstado={this.alterarEstado}
                                        />
                                    )
                                }
                            </Table>
                        </div>
                    ) :  (
                        <Alert color='warning'>Nenhuma tarefa encontrada</Alert> 
                    )
                
                }

                <TaskForm finish={this.lista}  />

            </div>
        );
    }

}

export default listaView;