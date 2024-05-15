from rest_framework import serializers
from .models import CustomUser
from django.contrib.auth import authenticate


# The CustomUserSerializer class is used to serialize the CustomUser model.
# This class is used to convert the CustomUser model instances to JSON format.
class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        # he fields attribute is used to specify which fields from the model should be included in the serializer.
        fields = ["id", "username", "email"]


# The UserRegistrationSerializer class is used to serialize the CustomUser model when creating a new user.
# This class is used to convert the data received from the client to a CustomUser model instance.
class UserRegistrationSerializer(serializers.ModelSerializer):
    #  These lines are added because we want to use the password_confirm field in the serializer.
    # So, when we receive the data from the client, we will check if the password and password_confirm fields are the same.
    # If they are not, we will raise a validation error.
    password = serializers.CharField(write_only=True)
    password_confirm = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUser

        # The fields attribute is used to specify which fields from the model should be included in the serializer.
        # In this case, we are including the id, username, email, password, and password_confirm fields.
        # These fields come from the CustomUser model. And we receive these when we create a new user. In the frontend we will send these fields.
        fields = ["id", "username", "email", "password", "password_confirm"]

        # The extra_kwargs attribute is used to specify additional properties for the fields.
        # In this case, we are setting the write_only property to True for the password and password_confirm fields.
        # This means that these fields will be used for input only and will not be included in the output.
        extra_kwargs = {
            "password": {"write_only": True},
            "password_confirm": {"write_only": True},
        }

    # The validate method is used to check if the password and password_confirm fields are the same.
    # This method is called when the serializer is validated.
    # If they are not, we raise a validation error.
    def validate(self, data):
        if data["password"] != data["password_confirm"]:
            raise serializers.ValidationError(
                {"password": "Password fields do not match."}
            )

        # Get the password field for custom validations
        password = data["password"]

        if len(password) < 8:
            raise serializers.ValidationError(
                {"password": "Password must be at least 8 characters long."}
            )

        return data

    def create(self, validated_data):
        # Remove the password_confirm field from the validated_data dictionary
        # because we don't need it when creating a new user.
        validated_data.pop("password_confirm")

        # Create a new user with the validated_data dictionary
        # This validated_data dictionary contains the username, email, and password fields.
        # They are received from the client when creating a new user.
        user = CustomUser.objects.create_user(**validated_data)

        return user


# The UserLoginSerializer class is used to serialize the CustomUser model when logging in a user.
# This class is used to convert the data received from the client to a CustomUser model instance.
# Whhe receive the email and password fields from the client when logging in a user and here we will use these fields to authenticate the user.
class UserLoginSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ["email", "password"]

    # The email and password fields received from the client are used to authenticate the user.
    email = serializers.EmailField(max_length=255)
    password = serializers.CharField(max_length=128, write_only=True)

    # The validate method is used to check if the email and password fields are valid, then authenticate the user.
    def validate(self, data):
        email = data["email"]
        password = data["password"]

        if email is None or password is None:
            raise serializers.ValidationError("Email and password are required")

        user = authenticate(email=email, password=password)

        if user is None:
            raise serializers.ValidationError("Invalid email or password")

        if user and user.is_active:
            return user
