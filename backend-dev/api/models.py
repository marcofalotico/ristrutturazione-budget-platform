from django.db import models

class Categoria(models.Model):
    nome = models.CharField(max_length=255)
    costo_max = models.DecimalField(max_digits=10, decimal_places=2)
    macro_area = models.CharField(max_length=255, blank=True)
    note = models.TextField(blank=True)
    costo_effettivo = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)

    def __str__(self):
        return self.nome
