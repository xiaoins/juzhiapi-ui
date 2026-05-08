<template>
  <div class="h-screen flex flex-col">
    <header class="bg-white border-b border-claude-border px-6 py-4">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-xl font-semibold text-claude-text">Wallet</h2>
          <p class="text-sm text-claude-muted mt-1">Manage your credits and view transaction history</p>
        </div>
        <button
          @click="showRechargeModal = true"
          class="px-4 py-2 bg-claude-accent hover:bg-claude-accent-hover text-white font-medium rounded-xl transition-all"
        >
          Recharge
        </button>
      </div>
    </header>

    <div class="flex-1 overflow-y-auto p-6">
      <div v-if="loading" class="flex items-center justify-center h-64">
        <div class="text-claude-muted">Loading...</div>
      </div>

      <template v-else>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div class="bg-white rounded-2xl border border-claude-border p-6">
            <p class="text-sm text-claude-muted mb-2">Current Balance</p>
            <p class="text-3xl font-bold text-claude-text">{{ wallet?.balance?.toLocaleString() || 0 }}</p>
            <p class="text-xs text-claude-subtle mt-1">credits</p>
          </div>
          <div class="bg-white rounded-2xl border border-claude-border p-6">
            <p class="text-sm text-claude-muted mb-2">Total Recharged</p>
            <p class="text-3xl font-bold text-green-600">{{ wallet?.totalRecharge?.toLocaleString() || 0 }}</p>
            <p class="text-xs text-claude-subtle mt-1">credits</p>
          </div>
          <div class="bg-white rounded-2xl border border-claude-border p-6">
            <p class="text-sm text-claude-muted mb-2">Total Used</p>
            <p class="text-3xl font-bold text-red-600">{{ wallet?.totalUsed?.toLocaleString() || 0 }}</p>
            <p class="text-xs text-claude-subtle mt-1">credits</p>
          </div>
        </div>

        <div class="bg-white rounded-2xl border border-claude-border">
          <div class="flex border-b border-claude-border">
            <button
              @click="activeTab = 'transactions'"
              class="px-6 py-4 font-medium transition-all"
              :class="activeTab === 'transactions' ? 'text-claude-accent border-b-2 border-claude-accent' : 'text-claude-muted hover:text-claude-text'"
            >
              Transaction History
            </button>
            <button
              @click="activeTab = 'orders'; loadOrders()"
              class="px-6 py-4 font-medium transition-all"
              :class="activeTab === 'orders' ? 'text-claude-accent border-b-2 border-claude-accent' : 'text-claude-muted hover:text-claude-text'"
            >
              Recharge Orders
            </button>
          </div>

          <!-- Transaction History Tab -->
          <div v-if="activeTab === 'transactions'">
            <div v-if="logs.length === 0" class="flex flex-col items-center justify-center py-12">
              <WalletIcon :size="48" class="text-claude-subtle mb-4" />
              <p class="text-claude-muted">No transactions yet</p>
            </div>

            <div v-else class="divide-y divide-claude-border">
              <div
                v-for="log in logs"
                :key="log.id"
                class="px-6 py-4 flex items-center justify-between hover:bg-claude-bg/50 transition-all"
              >
                <div class="flex items-center gap-4">
                  <div
                    class="w-10 h-10 rounded-full flex items-center justify-center"
                    :class="getTypeClass(log.type)"
                  >
                    <component :is="getTypeIcon(log.type)" :size="18" />
                  </div>
                  <div>
                    <p class="font-medium text-claude-text">{{ getTypeName(log.type) }}</p>
                    <p class="text-sm text-claude-subtle">{{ log.remark || '-' }}</p>
                  </div>
                </div>
                <div class="text-right">
                  <p
                    class="font-semibold"
                    :class="log.amount > 0 ? 'text-green-600' : 'text-red-600'"
                  >
                    {{ log.amount > 0 ? '+' : '' }}{{ log.amount.toLocaleString() }}
                  </p>
                  <p class="text-xs text-claude-subtle">{{ formatDate(log.createdAt) }}</p>
                </div>
              </div>
            </div>

            <div v-if="totalLogs > size" class="px-6 py-4 border-t border-claude-border">
              <button
                @click="loadMoreLogs"
                :disabled="loadingMore"
                class="w-full py-2 text-sm font-medium text-claude-accent hover:bg-claude-accent/5 rounded-xl transition-all disabled:opacity-50"
              >
                {{ loadingMore ? 'Loading...' : 'Load More' }}
              </button>
            </div>
          </div>

          <!-- Recharge Orders Tab -->
          <div v-if="activeTab === 'orders'">
            <div v-if="loadingOrders" class="flex items-center justify-center py-12">
              <div class="text-claude-muted">Loading...</div>
            </div>
            <div v-else-if="orders.length === 0" class="flex flex-col items-center justify-center py-12">
              <ShoppingCart :size="48" class="text-claude-subtle mb-4" />
              <p class="text-claude-muted">No recharge orders yet</p>
            </div>

            <div v-else class="divide-y divide-claude-border">
              <div
                v-for="order in orders"
                :key="order.id"
                class="px-6 py-4 hover:bg-claude-bg/50 transition-all"
              >
                <div class="flex items-center justify-between mb-3">
                  <div>
                    <p class="font-medium text-claude-text">{{ order.orderNo }}</p>
                    <p class="text-sm text-claude-subtle">{{ formatDate(order.createdAt) }}</p>
                  </div>
                  <span
                    class="px-3 py-1 rounded-full text-xs font-medium"
                    :class="getStatusClass(order.status)"
                  >
                    {{ getStatusName(order.status) }}
                  </span>
                </div>
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-sm text-claude-muted">Amount: <span class="text-claude-text font-medium">¥{{ order.amount.toFixed(2) }}</span></p>
                    <p class="text-sm text-claude-muted">Credits: <span class="text-claude-text font-medium">{{ order.credits.toLocaleString() }}</span></p>
                  </div>
                  <div>
                    <p class="text-sm text-claude-muted">Pay Type: <span class="text-claude-text font-medium">{{ getPayTypeName(order.payType) }}</span></p>
                    <p v-if="order.paidAt" class="text-sm text-claude-muted">Paid At: {{ formatDate(order.paidAt) }}</p>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="totalOrders > sizeOrders" class="px-6 py-4 border-t border-claude-border">
              <button
                @click="loadMoreOrders"
                :disabled="loadingMoreOrders"
                class="w-full py-2 text-sm font-medium text-claude-accent hover:bg-claude-accent/5 rounded-xl transition-all disabled:opacity-50"
              >
                {{ loadingMoreOrders ? 'Loading...' : 'Load More' }}
              </button>
            </div>
          </div>
        </div>
      </template>
    </div>

    <!-- Recharge Modal -->
    <div v-if="showRechargeModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" @click.self="closeRechargeModal">
      <div class="bg-white rounded-2xl p-6 w-full max-w-md mx-4 relative">
        <button
          @click="closeRechargeModal"
          class="absolute top-4 right-4 p-1 hover:bg-claude-secondary rounded-lg transition-all"
        >
          <X :size="20" class="text-claude-muted" />
        </button>
        <h3 class="text-lg font-semibold text-claude-text mb-4">Recharge Credits</h3>
        <p class="text-sm text-claude-muted mb-4">1 yuan = 1000 credits</p>
        
        <div v-if="rechargeError" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
          {{ rechargeError }}
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium text-claude-text mb-2">Amount (¥)</label>
          <input
            v-model.number="rechargeAmount"
            type="number"
            min="1"
            max="100000"
            placeholder="Enter amount"
            class="w-full px-4 py-3 rounded-xl border border-claude-border bg-claude-bg text-claude-text focus:outline-none focus:ring-2 focus:ring-claude-accent/50"
          />
        </div>

        <div class="mb-6">
          <label class="block text-sm font-medium text-claude-text mb-2">Payment Method</label>
          <div class="grid grid-cols-2 gap-3">
            <button
              v-for="method in paymentMethods"
              :key="method.value"
              @click="selectedPayType = method.value"
              class="px-4 py-3 rounded-xl border transition-all"
              :class="selectedPayType === method.value ? 'border-claude-accent bg-claude-accent/5' : 'border-claude-border hover:border-claude-accent/50'"
            >
              <component :is="method.icon" :size="20" class="mx-auto mb-1" />
              <span class="text-sm font-medium">{{ method.label }}</span>
            </button>
          </div>
        </div>

        <div class="flex gap-3">
          <button
            @click="closeRechargeModal"
            class="flex-1 py-2 px-4 border border-claude-border text-claude-text font-medium rounded-xl hover:bg-claude-secondary transition-all"
          >
            Cancel
          </button>
          <button
            @click="submitRecharge"
            :disabled="recharging || !rechargeAmount || !selectedPayType"
            class="flex-1 py-2 px-4 bg-claude-accent hover:bg-claude-accent-hover text-white font-medium rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ recharging ? 'Processing...' : 'Recharge' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Wallet as WalletIcon, ArrowUpCircle, ArrowDownCircle, Plus, Minus, ShoppingCart, X, CreditCard, Smartphone } from 'lucide-vue-next';
import { walletApi, WalletInfo, WalletLog, RechargeOrder, CreateRechargeOrderRequest } from '@/api/wallet';

const wallet = ref<WalletInfo | null>(null);
const logs = ref<WalletLog[]>([]);
const orders = ref<RechargeOrder[]>([]);
const loading = ref(false);
const loadingMore = ref(false);
const loadingOrders = ref(false);
const loadingMoreOrders = ref(false);
const current = ref(1);
const currentOrders = ref(1);
const size = 20;
const sizeOrders = 20;
const totalLogs = ref(0);
const totalOrders = ref(0);
const activeTab = ref('transactions');

// Recharge Modal
const showRechargeModal = ref(false);
const rechargeAmount = ref<number | null>(null);
const selectedPayType = ref('');
const recharging = ref(false);
const rechargeError = ref('');

const paymentMethods = [
  { value: 'ALIPAY', label: 'Alipay', icon: CreditCard },
  { value: 'WECHAT', label: 'WeChat', icon: Smartphone },
  { value: 'BANK_TRANSFER', label: 'Bank', icon: CreditCard },
  { value: 'MANUAL', label: 'Manual', icon: CreditCard },
];

async function loadWallet() {
  try {
    const res = await walletApi.getWallet();
    wallet.value = res.data;
  } catch (error) {
    console.error('Failed to load wallet:', error);
  }
}

async function loadLogs(append = false) {
  if (append) {
    loadingMore.value = true;
  } else {
    loading.value = true;
  }

  try {
    const res = await walletApi.getWalletLogs(current.value, size);
    if (append) {
      logs.value = [...logs.value, ...(res.data?.records || [])];
    } else {
      logs.value = res.data?.records || [];
    }
    totalLogs.value = res.data?.total || 0;
  } catch (error) {
    console.error('Failed to load logs:', error);
  } finally {
    loading.value = false;
    loadingMore.value = false;
  }
}

async function loadOrders(append = false) {
  if (append) {
    loadingMoreOrders.value = true;
  } else {
    loadingOrders.value = true;
  }

  try {
    const res = await walletApi.getRechargeOrders(currentOrders.value, sizeOrders);
    if (append) {
      orders.value = [...orders.value, ...(res.data?.records || [])];
    } else {
      orders.value = res.data?.records || [];
    }
    totalOrders.value = res.data?.total || 0;
  } catch (error) {
    console.error('Failed to load orders:', error);
  } finally {
    loadingOrders.value = false;
    loadingMoreOrders.value = false;
  }
}

function loadMoreLogs() {
  current.value++;
  loadLogs(true);
}

function loadMoreOrders() {
  currentOrders.value++;
  loadOrders(true);
}

async function submitRecharge() {
  if (!rechargeAmount.value || !selectedPayType.value) return;

  recharging.value = true;
  rechargeError.value = '';

  try {
    const data: CreateRechargeOrderRequest = {
      amount: rechargeAmount.value,
      payType: selectedPayType.value,
    };

    const res = await walletApi.createRechargeOrder(data);
    if (res.code === 200) {
      closeRechargeModal();
      await loadWallet();
      if (activeTab.value === 'orders') {
        currentOrders.value = 1;
        await loadOrders();
      }
    } else {
      rechargeError.value = res.msg || 'Recharge failed';
    }
  } catch (error: any) {
    rechargeError.value = error.response?.data?.msg || 'Recharge failed';
  } finally {
    recharging.value = false;
  }
}

function closeRechargeModal() {
  showRechargeModal.value = false;
  rechargeAmount.value = null;
  selectedPayType.value = '';
  rechargeError.value = '';
}

function getTypeClass(type: string) {
  switch (type) {
    case 'RECHARGE':
      return 'bg-green-100 text-green-600';
    case 'USAGE':
      return 'bg-red-100 text-red-600';
    case 'ADMIN_ADD':
      return 'bg-blue-100 text-blue-600';
    case 'ADMIN_DEDUCT':
      return 'bg-orange-100 text-orange-600';
    default:
      return 'bg-gray-100 text-gray-600';
  }
}

function getTypeIcon(type: string) {
  switch (type) {
    case 'RECHARGE':
      return ArrowUpCircle;
    case 'USAGE':
      return ArrowDownCircle;
    case 'ADMIN_ADD':
      return Plus;
    case 'ADMIN_DEDUCT':
      return Minus;
    default:
      return WalletIcon;
  }
}

function getTypeName(type: string) {
  switch (type) {
    case 'RECHARGE':
      return 'Recharge';
    case 'USAGE':
      return 'Usage';
    case 'ADMIN_ADD':
      return 'Admin Add';
    case 'ADMIN_DEDUCT':
      return 'Admin Deduct';
    case 'REFUND':
      return 'Refund';
    default:
      return type;
  }
}

function getStatusClass(status: string) {
  switch (status) {
    case 'PENDING':
      return 'bg-yellow-100 text-yellow-700';
    case 'PAID':
      return 'bg-green-100 text-green-700';
    case 'CANCELLED':
      return 'bg-red-100 text-red-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
}

function getStatusName(status: string) {
  switch (status) {
    case 'PENDING':
      return 'Pending';
    case 'PAID':
      return 'Paid';
    case 'CANCELLED':
      return 'Cancelled';
    default:
      return status;
  }
}

function getPayTypeName(payType: string) {
  switch (payType) {
    case 'ALIPAY':
      return 'Alipay';
    case 'WECHAT':
      return 'WeChat';
    case 'BANK_TRANSFER':
      return 'Bank Transfer';
    case 'MANUAL':
      return 'Manual';
    default:
      return payType;
  }
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

onMounted(async () => {
  loading.value = true;
  await Promise.all([loadWallet(), loadLogs()]);
  loading.value = false;
});
</script>
