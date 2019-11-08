from rest_framework import serializers
from .models import User

class UserSerializer(serializers.ModelSerializer):
	class Meta:
		model = User
		fields = ['uid', 'username', 'telephone',
		          'email', 'is_active', 'is_staff', 'date_joined']