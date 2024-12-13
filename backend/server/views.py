from django.shortcuts import render
from django.http import JsonResponse, HttpResponse
from .models import Transaction
import csv
from django.views.decorators.csrf import csrf_exempt

# Create your views here.
def index(request):
    return render(request, 'index.html')
@csrf_exempt
def upload_csv(request):
    if request.method == 'POST':
        csv_file = request.FILES['file'] # original csv
        decoded_file = csv_file.read().decode('utf-8').splitlines() # list where each item is each row of the file
        reader = csv.DictReader(decoded_file) # maps the first row items as keys to other subsequent rows as values
        for row in reader:
            Transaction.objects.create(amount=row['amount'], date=row['date'], description=row['description'])
        return JsonResponse({'message': 'CSV file uploaded successfully'})
    return HttpResponse(status=400)

def get_monthly_spending(request):
    monthly_spending = Transaction.objects.all().values('date', 'amount', 'description')
    # convert query set into a  list of dictionaries
    monthly_spending_list = list(monthly_spending)
    return JsonResponse(monthly_spending_list, safe=False)