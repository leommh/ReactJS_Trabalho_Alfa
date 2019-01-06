import React, {Component} from 'react';
import {Alert, Input, Button, Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';
import {cadTarefa} from '../components/Api';

class TaskForm extends Component {

    state = {
        modal: false,
        erros: []
    }

    toggle = () => {
        this.setState({
            modal: !this.state.modal
        });
    }

    onSubmit = (e) => {
        e.preventDefault();
        cadTarefa(this.state)
        .then(res => {
            this.setState({titulo:'', descricao:''});
            this.toggle();
            this.props.finish();  
        })
        .catch (err => {
            let erros = []
            Object.values(err.response.data.validationErrors).map(err => erros.push(err))
            this.setState({erros})
        })
    }

    onChange = (e) => {
        this.setState({[e.target.name]:e.target.value});
    }

    render () {
        const {erros} = this.state;
        return (
            <div>

                <Button color="primary" onClick={this.toggle}>Nova Tarefa</Button>
                <form onSubmit={this.onSubmit}>
                    <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
                        <ModalHeader toggle={this.toggle}>Nova Tarefa</ModalHeader>
                        <ModalBody>
                            <div>
                                <Input type="text" name="titulo" placeholder="título" onChange={this.onChange}  />
                                <Input type="text" name="descricao" placeholder="descrição" onChange={this.onChange} />
                                {
                                    erros !== undefined && erros.length > 0 && (
                                        <Alert color="danger"> 
                                            { erros.map(erro => <p>{erro.msg}</p> ) }
                                        </Alert>
                                    )
                                }
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <Button type="submit" color="primary" onClick={this.onSubmit}>Cadastrar</Button>
                            {' '}
                            <Button color="secondary" onClick={this.toggle}>Cancelar</Button>
                        </ModalFooter>
                    </Modal>
                </form>

            </div>
        );
    }
        
}

export default TaskForm;