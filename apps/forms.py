
class FormMixin(object):
	def get_errors(self):
		if hasattr(self, 'errors'):
			# 格式化错误信息，在视图中快速获取错误信息并返回前端
			errors = self.errors.get_json_data()
			new_errors = {}
			for key, message_dicts in errors.items():
				messages = []
				for error in message_dicts:
					message = error['message']
					messages.append(message)
				new_errors[key] = messages
			return new_errors
		else:
			return {}