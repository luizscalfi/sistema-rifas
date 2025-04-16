from flask import Blueprint, request, jsonify
from models import Rifa, Comprador
from database import db
import random

bp = Blueprint('api', __name__)

@bp.route('/rifas', methods=['GET'])
def listar_rifas():
    rifas = Rifa.query.all()
    return jsonify([{
        'id': r.id,
        'nome': r.nome,
        'descricao': r.descricao,
        'total_numeros': r.total_numeros
    } for r in rifas])

@bp.route('/rifas', methods=['POST'])
def criar_rifa():
    data = request.json
    nova = Rifa(
        nome=data['nome'],
        descricao=data.get('descricao', ''),
        total_numeros=data.get('total_numeros', 0)
    )
    db.session.add(nova)
    db.session.commit()
    return jsonify({'id': nova.id}), 201

@bp.route('/rifas/<int:rifa_id>', methods=['GET'])
def ver_rifa(rifa_id):
    rifa = Rifa.query.get_or_404(rifa_id)
    return jsonify({
        'id': rifa.id,
        'nome': rifa.nome,
        'descricao': rifa.descricao,
        'total_numeros': rifa.total_numeros,
        'compradores': [
            {
                'id': c.id,
                'nome': c.nome,
                'contato': c.contato,
                'numeros': [int(n) for n in c.numeros.split(',') if n]
            } for c in rifa.compradores
        ]
    })

@bp.route('/rifas/<int:rifa_id>', methods=['PUT'])
def editar_rifa(rifa_id):
    rifa = Rifa.query.get_or_404(rifa_id)
    data = request.json
    rifa.nome = data.get('nome', rifa.nome)
    rifa.descricao = data.get('descricao', rifa.descricao)
    rifa.total_numeros = data.get('total_numeros', rifa.total_numeros)
    db.session.commit()
    return jsonify({'mensagem': 'Rifa atualizada com sucesso'})

@bp.route('/rifas/<int:rifa_id>', methods=['DELETE'])
def deletar_rifa(rifa_id):
    rifa = Rifa.query.get_or_404(rifa_id)
    db.session.delete(rifa)
    db.session.commit()
    return jsonify({'mensagem': 'Rifa deletada com sucesso'})

@bp.route('/rifas/<int:rifa_id>/compradores', methods=['GET'])
def listar_compradores(rifa_id):
    compradores = Comprador.query.filter_by(rifa_id=rifa_id).all()
    return jsonify([
        {
            'id': c.id,
            'nome': c.nome,
            'contato': c.contato,
            'numeros': [int(n) for n in c.numeros.split(',') if n]
        } for c in compradores
    ])

@bp.route('/rifas/<int:rifa_id>/compradores', methods=['POST'])
def adicionar_comprador(rifa_id):
    data = request.json
    novo = Comprador(
        nome=data['nome'],
        contato=data.get('contato', ''),
        numeros=','.join(str(n) for n in data.get('numeros', [])),
        rifa_id=rifa_id
    )
    db.session.add(novo)
    db.session.commit()
    return jsonify({'id': novo.id}), 201

@bp.route('/compradores/<int:comprador_id>', methods=['GET'])
def obter_comprador(comprador_id):
    comprador = Comprador.query.get_or_404(comprador_id)
    return jsonify({
        'id': comprador.id,
        'nome': comprador.nome,
        'contato': comprador.contato,
        'numeros': [int(n) for n in comprador.numeros.split(',') if n],
        'rifa_id': comprador.rifa_id
    })

@bp.route('/compradores/<int:comprador_id>', methods=['PUT'])
def editar_comprador(comprador_id):
    comprador = Comprador.query.get_or_404(comprador_id)
    data = request.json
    comprador.nome = data.get('nome', comprador.nome)
    comprador.contato = data.get('contato', comprador.contato)
    if 'numeros' in data:
        comprador.numeros = ','.join(str(n) for n in data['numeros'])
    db.session.commit()
    return jsonify({'mensagem': 'Comprador atualizado com sucesso'})

@bp.route('/compradores/<int:comprador_id>', methods=['DELETE'])
def deletar_comprador(comprador_id):
    comprador = Comprador.query.get_or_404(comprador_id)
    db.session.delete(comprador)
    db.session.commit()
    return jsonify({'mensagem': 'Comprador deletado com sucesso'})

@bp.route('/rifas/<int:rifa_id>/sortear', methods=['POST'])
def sortear_rifa(rifa_id):
    rifa = Rifa.query.get_or_404(rifa_id)
    compradores = rifa.compradores

    numeros_comprados = []
    mapa_numeros = {}

    for c in compradores:
        numeros = [int(n) for n in c.numeros.split(',') if n]
        for n in numeros:
            numeros_comprados.append(n)
            mapa_numeros[n] = {
                'comprador_id': c.id,
                'nome': c.nome,
                'contato': c.contato
            }

    if not numeros_comprados:
        return jsonify({'mensagem': 'Nenhum número comprado ainda'}), 400

    numero_sorteado = random.choice(numeros_comprados)
    ganhador = mapa_numeros[numero_sorteado]

    return jsonify({
        'numero_sorteado': numero_sorteado,
        'ganhador': ganhador
    })
