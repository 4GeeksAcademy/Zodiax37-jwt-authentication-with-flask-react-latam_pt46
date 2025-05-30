"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS

from werkzeug.security import generate_password_hash, check_password_hash
from bcrypt import gensalt
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt, create_access_token


api = Blueprint('api', __name__)

# Allow CORS requests to this API
# CORS(api)



@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200


@api.route('/sign', methods=['POST'])
def handle_SignUp():
    data = request.get_json()
    email=data.get("email")
    password=data.get("password")
    if not email or not password:
        return jsonify({"msg": "Rellene todos los campos faltan y esas cosas"}), 400
    userInBD = User.query.filter_by(email=email).first()
    if userInBD:
        return jsonify({"msg": "El usuario ya esta registrado"}), 400

    hash_pass= generate_password_hash(password)
    newUser= User(email=email, password=hash_pass, is_active=True)
    db.session.add(newUser)
    db.session.commit()

    return jsonify({"msg": "Se ha creado el user"}), 201


    
@api.route('/token', methods=['POST'])
def handle_token():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"msg": "No se recibió JSON"}), 400

        user_id = data.get("user_id")
        if not user_id:
            return jsonify({"msg": "Falta identificador"}), 401

        print("Creando token para user_id:", user_id)
        token = create_access_token(identity=str(user_id))

        return jsonify(token=token), 200

    except Exception as e:
        print("ERROR EN /api/token:", str(e)) 
        return jsonify({"msg": "Error interno", "error": str(e)}), 500




@api.route('/login', methods=['POST'])
def handle_login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")
    
    if not email or not password:
        return jsonify({"msg": "Rellene todos los campos faltan y esas cosas"}), 400

    userInBD = User.query.filter_by(email=email).first()

    if not userInBD or not check_password_hash(userInBD.password, password):
        return jsonify({"msg": "Credenciales inválidas"}), 401

    return jsonify({"msg": "Login correcto", "user_id": userInBD.id}), 200

    

@api.route('/private', methods=['POST'])
@jwt_required()
def handle_private():
    user_id = get_jwt_identity()
    print("user_id en /private:", user_id)
    
    print("TOKEN RECIBIDO", get_jwt())
    print("IDENTIDAD:", get_jwt_identity())

    user = db.session.get(User, user_id)

    print("TOKEN RECIBIDO", get_jwt())
    print("IDENTIDAD:", get_jwt_identity())

    if not user:
        return jsonify({"msg": "Usuario no encontrado"}), 404

    return jsonify({"msg": "Cosas que no deberían verse pero aja", "user": user.serialize(), "pass":user.password}), 200

