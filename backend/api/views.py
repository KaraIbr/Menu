from django.db.models import Prefetch
from rest_framework import viewsets, generics, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Category, Product, ModifierGroup, Modifier, Order, OrderItem, Personal
from .serializers import (
    CategorySerializer,
    ProductSerializer,
    OrderSerializer,
    OrderCreateSerializer,
    PersonalSerializer,
    PersonalCreateSerializer,
    PersonalLoginSerializer,
)


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = [AllowAny]
    serializer_class = CategorySerializer
    http_method_names = ['get']

    def get_queryset(self):
        return Category.objects.filter(activo=True).prefetch_related(
            Prefetch(
                'products',
                queryset=Product.objects.filter(activo=True, disponible=True)
                .prefetch_related(
                    Prefetch(
                        'modifier_groups',
                        queryset=ModifierGroup.objects.filter(activo=True).prefetch_related(
                            Prefetch('modifiers', queryset=Modifier.objects.filter(activo=True))
                        ),
                    )
                )
            )
        ).order_by('orden', 'nombre')


class ProductViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = [AllowAny]
    serializer_class = ProductSerializer
    http_method_names = ['get']

    def get_queryset(self):
        qs = Product.objects.filter(activo=True).prefetch_related(
            Prefetch(
                'modifier_groups',
                queryset=ModifierGroup.objects.filter(activo=True).prefetch_related(
                    Prefetch('modifiers', queryset=Modifier.objects.filter(activo=True))
                ),
            )
        )
        category_id = self.request.query_params.get('category')
        if category_id:
            qs = qs.filter(category_id=category_id)
        disponible = self.request.query_params.get('solo_disponibles', 'true').lower()
        if disponible == 'true':
            qs = qs.filter(disponible=True)
        return qs.order_by('nombre')


class MenuView(APIView):
    permission_classes = [AllowAny]
    http_method_names = ['get']

    def get(self, request):
        categories = CategoryViewSet().get_queryset()
        serializer = CategorySerializer(categories, many=True, context={'request': request})
        return Response({'categories': serializer.data})


class OrderCreateAPIView(generics.CreateAPIView):
    serializer_class = OrderCreateSerializer
    permission_classes = [AllowAny]
    http_method_names = ['post']

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        order = serializer.save()
        output = OrderSerializer(order, context=self.get_serializer_context())
        headers = self.get_success_headers(output.data)
        return Response(output.data, status=status.HTTP_201_CREATED, headers=headers)


class OrderListAPIView(generics.ListAPIView):
    serializer_class = OrderSerializer
    authentication_classes = []
    permission_classes = [AllowAny]
    http_method_names = ['get']

    def get_queryset(self):
        estado = self.request.query_params.get('estado')
        qs = Order.objects.prefetch_related(
            Prefetch(
                'items',
                queryset=OrderItem.objects.select_related('product').prefetch_related('selected_modifiers'),
            )
        )
        if estado:
            qs = qs.filter(estado=estado)
        return qs.order_by('-created_at')


class OrderDetailAPIView(generics.RetrieveAPIView):
    serializer_class = OrderSerializer
    authentication_classes = []
    permission_classes = [AllowAny]
    queryset = Order.objects.prefetch_related(
        Prefetch(
            'items',
            queryset=OrderItem.objects.select_related('product').prefetch_related('selected_modifiers'),
        )
    )
    http_method_names = ['get']


class OrderStatusUpdateAPIView(generics.UpdateAPIView):
    serializer_class = OrderSerializer
    authentication_classes = []
    permission_classes = [AllowAny]
    queryset = Order.objects.all()
    http_method_names = ['patch']

    ALLOWED_TRANSITIONS = {
        'pendiente': {'preparando', 'cancelado'},
        'preparando': {'listo', 'cancelado'},
        'listo': {'entregado', 'cancelado'},
        'entregado': set(),
        'cancelado': set(),
    }

    def update(self, request, *args, **kwargs):
        order = self.get_object()
        new_estado = request.data.get('estado')
        if not new_estado:
            return Response({'detail': 'El campo "estado" es obligatorio.'}, status=status.HTTP_400_BAD_REQUEST)

        valid_states = dict(Order.Estado.choices).keys()
        if new_estado not in valid_states:
            return Response({'detail': 'Estado no valido.'}, status=status.HTTP_400_BAD_REQUEST)

        allowed = self.ALLOWED_TRANSITIONS.get(order.estado, set())
        if new_estado not in allowed:
            return Response(
                {'detail': f'Transicion de {order.estado} a {new_estado} no permitida.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        order.estado = new_estado
        order.save(update_fields=['estado', 'updated_at'])
        serializer = self.get_serializer(order)
        return Response(serializer.data)


class PersonalLoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = PersonalLoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        try:
            personal = Personal.objects.get(username=serializer.validated_data['username'], activo=True)
        except Personal.DoesNotExist:
            return Response({'detail': 'Credenciales invalidas.'}, status=status.HTTP_401_UNAUTHORIZED)
        
        if not personal.check_password(serializer.validated_data['password']):
            return Response({'detail': 'Credenciales invalidas.'}, status=status.HTTP_401_UNAUTHORIZED)
        
        return Response({
            'id': personal.id,
            'nombre': personal.nombre,
            'username': personal.username,
            'rol': personal.rol,
        })


class PersonalViewSet(viewsets.ModelViewSet):
    queryset = Personal.objects.all()
    authentication_classes = []
    permission_classes = [AllowAny]

    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return PersonalCreateSerializer
        return PersonalSerializer


class CategoryAdminViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    authentication_classes = []
    permission_classes = [AllowAny]
    http_method_names = ['get', 'post', 'put', 'patch', 'delete']

    def get_queryset(self):
        return Category.objects.all().order_by('orden', 'nombre')


class ProductAdminViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    authentication_classes = []
    permission_classes = [AllowAny]
    http_method_names = ['get', 'post', 'put', 'patch', 'delete']

    def get_queryset(self):
        qs = Product.objects.select_related('category').prefetch_related(
            Prefetch(
                'modifier_groups',
                queryset=ModifierGroup.objects.prefetch_related('modifiers'),
            )
        )
        
        rol = self.request.query_params.get('rol')
        if rol == 'barista':
            qs = qs.filter(category__tipo='bebida')
        elif rol == 'cocinero':
            qs = qs.filter(category__tipo='comida')
        
        category_id = self.request.query_params.get('category')
        if category_id:
            qs = qs.filter(category_id=category_id)
        
        return qs.order_by('nombre')


class ModifierGroupAdminViewSet(viewsets.ModelViewSet):
    queryset = ModifierGroup.objects.all()
    authentication_classes = []
    permission_classes = [AllowAny]
    http_method_names = ['get', 'post', 'put', 'patch', 'delete']


class ModifierAdminViewSet(viewsets.ModelViewSet):
    queryset = Modifier.objects.all()
    authentication_classes = []
    permission_classes = [AllowAny]
    http_method_names = ['get', 'post', 'put', 'patch', 'delete']
