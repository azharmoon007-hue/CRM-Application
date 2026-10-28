import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../models/api-response.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CrmApiService {
  private http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  // ---------------------------------------------------------------------------
  // DASHBOARD APIs
  // ---------------------------------------------------------------------------
  getDashboardSummary(): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.baseUrl}/dashboard/summary`);
  }

  getDashboardRevenue(): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.baseUrl}/dashboard/revenue`);
  }

  getDashboardLeadsBySource(): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.baseUrl}/dashboard/leads-by-source`);
  }

  getDashboardDealsByStage(): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.baseUrl}/dashboard/deals-by-stage`);
  }

  getDashboardSalesPerformance(): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.baseUrl}/dashboard/sales-performance`);
  }

  getDashboardMonthlySales(): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.baseUrl}/dashboard/monthly-sales`);
  }

  // ---------------------------------------------------------------------------
  // CUSTOMER APIs
  // ---------------------------------------------------------------------------
  getCustomers(page = 0, size = 20, search?: string, status?: string): Observable<ApiResponse<any[]>> {
    let params = new HttpParams().set('page', page).set('size', size);
    if (search) params = params.set('search', search);
    if (status && status !== 'ALL') params = params.set('status', status);
    return this.http.get<ApiResponse<any[]>>(`${this.baseUrl}/customers`, { params });
  }

  getCustomerById(id: string): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.baseUrl}/customers/${id}`);
  }

  createCustomer(data: any): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.baseUrl}/customers`, data);
  }

  updateCustomer(id: string, data: any): Observable<ApiResponse<any>> {
    return this.http.put<ApiResponse<any>>(`${this.baseUrl}/customers/${id}`, data);
  }

  deleteCustomer(id: string): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.baseUrl}/customers/${id}`);
  }

  // ---------------------------------------------------------------------------
  // LEADS APIs
  // ---------------------------------------------------------------------------
  getLeads(page = 0, size = 20, search?: string, status?: string): Observable<ApiResponse<any[]>> {
    let params = new HttpParams().set('page', page).set('size', size);
    if (search) params = params.set('search', search);
    if (status && status !== 'ALL') params = params.set('status', status);
    return this.http.get<ApiResponse<any[]>>(`${this.baseUrl}/leads`, { params });
  }

  getLeadById(id: string): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.baseUrl}/leads/${id}`);
  }

  createLead(data: any): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.baseUrl}/leads`, data);
  }

  updateLead(id: string, data: any): Observable<ApiResponse<any>> {
    return this.http.put<ApiResponse<any>>(`${this.baseUrl}/leads/${id}`, data);
  }

  deleteLead(id: string): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.baseUrl}/leads/${id}`);
  }

  updateLeadStatus(id: string, status: string): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.baseUrl}/leads/${id}/status`, { status });
  }

  qualifyLead(id: string): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.baseUrl}/leads/${id}/qualify`, {});
  }

  convertLead(id: string, data: any): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.baseUrl}/leads/${id}/convert`, data);
  }

  assignLead(id: string, userId: string): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.baseUrl}/leads/${id}/assign`, { userId });
  }

  // ---------------------------------------------------------------------------
  // DEALS & PIPELINE APIs
  // ---------------------------------------------------------------------------
  getDeals(page = 0, size = 20, search?: string, status?: string): Observable<ApiResponse<any[]>> {
    let params = new HttpParams().set('page', page).set('size', size);
    if (search) params = params.set('search', search);
    if (status && status !== 'ALL') params = params.set('status', status);
    return this.http.get<ApiResponse<any[]>>(`${this.baseUrl}/deals`, { params });
  }

  getDealById(id: string): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.baseUrl}/deals/${id}`);
  }

  createDeal(data: any): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.baseUrl}/deals`, data);
  }

  updateDeal(id: string, data: any): Observable<ApiResponse<any>> {
    return this.http.put<ApiResponse<any>>(`${this.baseUrl}/deals/${id}`, data);
  }

  deleteDeal(id: string): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.baseUrl}/deals/${id}`);
  }

  updateDealStage(id: string, stageId: string): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.baseUrl}/deals/${id}/stage`, { stageId });
  }

  markDealWon(id: string, notes?: string): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.baseUrl}/deals/${id}/won`, { notes });
  }

  markDealLost(id: string, reason?: string): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.baseUrl}/deals/${id}/lost`, { reason });
  }

  getDealMetrics(): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.baseUrl}/deals/metrics`);
  }

  getPipelines(): Observable<ApiResponse<any[]>> {
    return this.http.get<ApiResponse<any[]>>(`${this.baseUrl}/pipelines`);
  }

  getPipelineStages(pipelineId: string): Observable<ApiResponse<any[]>> {
    return this.http.get<ApiResponse<any[]>>(`${this.baseUrl}/pipelines/${pipelineId}/stages`);
  }

  // ---------------------------------------------------------------------------
  // ACTIVITIES APIs
  // ---------------------------------------------------------------------------
  getActivities(page = 0, size = 20): Observable<ApiResponse<any[]>> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<ApiResponse<any[]>>(`${this.baseUrl}/activities`, { params });
  }

  createActivity(data: any): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.baseUrl}/activities`, data);
  }

  updateActivity(id: string, data: any): Observable<ApiResponse<any>> {
    return this.http.put<ApiResponse<any>>(`${this.baseUrl}/activities/${id}`, data);
  }

  deleteActivity(id: string): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.baseUrl}/activities/${id}`);
  }

  // ---------------------------------------------------------------------------
  // TASKS APIs
  // ---------------------------------------------------------------------------
  getTasks(page = 0, size = 20): Observable<ApiResponse<any[]>> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<ApiResponse<any[]>>(`${this.baseUrl}/tasks`, { params });
  }

  createTask(data: any): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.baseUrl}/tasks`, data);
  }

  updateTask(id: string, data: any): Observable<ApiResponse<any>> {
    return this.http.put<ApiResponse<any>>(`${this.baseUrl}/tasks/${id}`, data);
  }

  deleteTask(id: string): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.baseUrl}/tasks/${id}`);
  }

  // ---------------------------------------------------------------------------
  // CONTACTS APIs
  // ---------------------------------------------------------------------------
  getContacts(page = 0, size = 20): Observable<ApiResponse<any[]>> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<ApiResponse<any[]>>(`${this.baseUrl}/contacts`, { params });
  }

  createContact(data: any): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.baseUrl}/contacts`, data);
  }

  updateContact(id: string, data: any): Observable<ApiResponse<any>> {
    return this.http.put<ApiResponse<any>>(`${this.baseUrl}/contacts/${id}`, data);
  }

  deleteContact(id: string): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.baseUrl}/contacts/${id}`);
  }

  // ---------------------------------------------------------------------------
  // NOTES APIs
  // ---------------------------------------------------------------------------
  getNotes(entityType?: string, entityId?: string): Observable<ApiResponse<any[]>> {
    let params = new HttpParams();
    if (entityType) params = params.set('entityType', entityType);
    if (entityId) params = params.set('entityId', entityId);
    return this.http.get<ApiResponse<any[]>>(`${this.baseUrl}/notes`, { params });
  }

  createNote(data: any): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.baseUrl}/notes`, data);
  }

  updateNote(id: string, data: any): Observable<ApiResponse<any>> {
    return this.http.put<ApiResponse<any>>(`${this.baseUrl}/notes/${id}`, data);
  }

  deleteNote(id: string): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.baseUrl}/notes/${id}`);
  }

  // ---------------------------------------------------------------------------
  // EMAILS APIs
  // ---------------------------------------------------------------------------
  getEmails(page = 0, size = 20): Observable<ApiResponse<any[]>> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<ApiResponse<any[]>>(`${this.baseUrl}/emails`, { params });
  }

  sendEmail(data: any): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.baseUrl}/emails/send`, data);
  }

  getEmailTemplates(): Observable<ApiResponse<any[]>> {
    return this.http.get<ApiResponse<any[]>>(`${this.baseUrl}/emails/templates`);
  }

  createEmailTemplate(data: any): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.baseUrl}/emails/templates`, data);
  }

  // ---------------------------------------------------------------------------
  // NOTIFICATIONS APIs
  // ---------------------------------------------------------------------------
  getNotifications(): Observable<ApiResponse<any[]>> {
    return this.http.get<ApiResponse<any[]>>(`${this.baseUrl}/notifications`);
  }

  markNotificationRead(id: string): Observable<ApiResponse<any>> {
    return this.http.put<ApiResponse<any>>(`${this.baseUrl}/notifications/${id}/read`, {});
  }

  markAllNotificationsRead(): Observable<ApiResponse<any>> {
    return this.http.put<ApiResponse<any>>(`${this.baseUrl}/notifications/read-all`, {});
  }

  // ---------------------------------------------------------------------------
  // AUDIT LOGS APIs
  // ---------------------------------------------------------------------------
  getAuditLogs(page = 0, size = 20): Observable<ApiResponse<any[]>> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<ApiResponse<any[]>>(`${this.baseUrl}/audit-logs`, { params });
  }

  // ---------------------------------------------------------------------------
  // USERS APIs
  // ---------------------------------------------------------------------------
  getUsers(page = 0, size = 20): Observable<ApiResponse<any[]>> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<ApiResponse<any[]>>(`${this.baseUrl}/users`, { params });
  }

  getUserById(id: string): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.baseUrl}/users/${id}`);
  }

  createUser(data: any): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.baseUrl}/users`, data);
  }

  updateUser(id: string, data: any): Observable<ApiResponse<any>> {
    return this.http.put<ApiResponse<any>>(`${this.baseUrl}/users/${id}`, data);
  }

  deleteUser(id: string): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.baseUrl}/users/${id}`);
  }

  // ---------------------------------------------------------------------------
  // REPORTS APIs
  // ---------------------------------------------------------------------------
  getSalesReport(): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.baseUrl}/reports/sales`);
  }

  exportSalesPdf(): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/reports/sales/export/pdf`, { responseType: 'blob' });
  }

  exportSalesExcel(): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/reports/sales/export/excel`, { responseType: 'blob' });
  }

  getLeadsReport(): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.baseUrl}/reports/leads`);
  }

  getCustomersReport(): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.baseUrl}/reports/customers`);
  }

  // ---------------------------------------------------------------------------
  // GLOBAL SEARCH APIs
  // ---------------------------------------------------------------------------
  search(query: string): Observable<ApiResponse<any>> {
    const params = new HttpParams().set('query', query);
    return this.http.get<ApiResponse<any>>(`${this.baseUrl}/search`, { params });
  }
}
