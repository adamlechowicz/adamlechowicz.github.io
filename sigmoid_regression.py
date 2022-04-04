# Adam Lechowicz
# April 2022
# UMass SGA Ways & Means Budget Tool

import numpy as np
import pylab
from scipy.optimize import curve_fit

def sigmoid(x, L ,x0, k, b):
    y = L / (1 + np.exp(-k*(x-x0))) + b
    return (y)

class BudgetTool:
  def __init__(self, brackets):
      self.brackets = brackets
      self.cutoffs = list(brackets.keys())
      self.percents = list(brackets.values())
      sigmoids = []
      buffers = []
      self.length = len(brackets)
      # learn cut structure for each bracket
      for i in range(self.length - 1):
          cutoff = self.cutoffs[i]
          cutLeft = self.percents[i]
          cutRight = self.percents[i+1]
          sigmoidBuffer = 0.2 * cutoff

          xbufferleft = np.array([cutoff-3*sigmoidBuffer, cutoff-1*sigmoidBuffer])
          xbufferright = np.array([cutoff+1*sigmoidBuffer, cutoff+2*sigmoidBuffer, cutoff+3*sigmoidBuffer])
          ybufferleft = np.array([cutLeft, cutLeft])
          ybufferright = np.array([cutRight, cutRight, cutRight])
          xdata = np.concatenate((xbufferleft, xbufferright))
          ydata = np.concatenate((ybufferleft, ybufferright))

          p0 = [max(ydata), np.median(xdata),0.0001, min(ydata)] # this is an mandatory initial guess

          popt, pcov = curve_fit(sigmoid, xdata, ydata, p0, method='lm')

          buffers.append(cutoff - sigmoidBuffer)
          sigmoids.append(popt)
      buffers.append(float('inf'))

      self.buffers = buffers
      self.sigmoids = sigmoids

  def getCutPercent(self, value):
    if (value > self.cutoffs[-1]):
        print("{:.4f}".format(self.percents[-1]))
        return
    prev = 0.0
    for i in range(self.length):
        if value >= prev and value < self.cutoffs[i]:
            if value >= self.buffers[i]:
                popt = self.sigmoids[i]
                sigResult = sigmoid(value, *popt)
                print("{:.4f}".format(sigResult))
            else:
                print("{:.4f}".format(self.percents[i]))
            return
    print("error")
    
  def getCut(self, value):
    if (value > self.cutoffs[-1]):
        print("{:.4f}".format(self.percents[-1]))
        return self.percents[-1]
    prev = 0.0
    for i in range(self.length):
        if value >= prev and value < self.cutoffs[i]:
            if value >= self.buffers[i]:
                popt = self.sigmoids[i]
                sigResult = sigmoid(value, *popt)
                print("{:.4f}".format(sigResult))
                return sigResult
            else:
                print("{:.4f}".format(self.percents[i]))
                return self.percents[i]
    print("error")
